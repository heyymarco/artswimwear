// models:
import type {
    CreateOrderOptions,
    CaptureFundData,
}                           from '@/models'

// configs:
import {
    checkoutConfig,
}                           from '@/checkout.config.server'



// utilities:
const midtransBaseUrl = {
    development : 'https://api.sandbox.midtrans.com',
    production  : 'https://api.midtrans.com',
};
const midtransUrl = midtransBaseUrl.development; // TODO: auto switch development vs production



const midtransHandleResponse = async (response: Response) => {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    } // if
    
    
    
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}

const midtransCreateAuthToken = () => {
    const auth = Buffer.from(`${process.env.MIDTRANS_ID}:`).toString('base64');
    return auth;
}
export const midtransCaptureFund = async (midtransPaymentToken: string, orderId: string, options: CreateOrderOptions): Promise<CaptureFundData|null|string> => {
    const {
        preferredCurrency,
        totalCostConverted,
        totalProductPriceConverted,
        totalShippingCostConverted,
        
        detailedItems,
        
        hasShippingAddress,
        shippingFirstName,
        shippingLastName,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        hasBillingAddress,
        billingFirstName,
        billingLastName,
        billingPhone,
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
    } = options;
    
    
    
    const response = await fetch(`${midtransUrl}/v2/charge`, {
        method  : 'POST',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Basic ${midtransCreateAuthToken()}`,
        },
        body    : JSON.stringify({
            payment_type         : 'credit_card',
            transaction_details  : {
                order_id         : orderId,
                gross_amount     : totalCostConverted,
            },
            credit_card          : {
                token_id         : midtransPaymentToken,
                authentication   : true,
                callback_type    : 'js_event',
            },
            item_details         : detailedItems.map((detailedItem) => ({
                name             : detailedItem.productName + (!detailedItem.variantNames.length ? '' : `(${detailedItem.variantNames.join(', ')})`),
                price            : detailedItem.priceConverted,
                quantity         : detailedItem.quantity,
            })),
            customer_details     : {
                first_name       : shippingFirstName,
                last_name        : shippingLastName,
                email            : undefined,
                phone            : shippingPhone,
                shipping_address : {
                    first_name   : shippingFirstName,
                    last_name    : shippingLastName,
                    email        : undefined,
                    phone        : shippingPhone,
                    address      : shippingAddress,
                    city         : shippingCity,
                    postal_code  : shippingZip,
                    country_code : shippingCountry && ['ID', 'IDN'].includes(shippingCountry) ? 'IDN' : undefined,
                },
                billing_address  : {
                    first_name   : billingFirstName,
                    last_name    : billingLastName,
                    email        : undefined,
                    phone        : billingPhone,
                    address      : billingAddress,
                    city         : billingCity,
                    postal_code  : billingZip,
                    country_code : billingCountry && ['ID', 'IDN'].includes(billingCountry) ? 'IDN' : undefined,
                },
            },
        }),
    });
    const midtransPaymentData = await midtransHandleResponse(response);
    switch (`${midtransPaymentData.status_code}` /* stringify */) {
        case '202': {
            // Deny Notification
            
            
            
            return null;
        }
        case '201' : {
            // Success
            // -or-
            // Challenge Notification
            
            
            
            const redirectUrl = midtransPaymentData.redirect_url;
            if ((midtransPaymentData.fraud_status === 'challenge') || (typeof(redirectUrl) !== 'string') || !redirectUrl) {
                // The transaction is successfully sent to the bank but yet to be approved
                
                
                
                // assumes as denied:
                return null;
            } // if
            
            
            
            return redirectUrl;
        }
        case '200' : {
            // Capture Notification after submit OTP 3DS 2.0
            // Capture Notification
            // Settlement Notification
            
            
            
            return {
                paymentSource : {
                    card : (midtransPaymentData.payment_type !== 'credit_card') ? undefined : {
                        type       : 'CARD',
                        brand      : midtransPaymentData.bank?.toLowerCase() ?? null,
                        identifier : midtransPaymentData.masked_card ? `ending with ${midtransPaymentData.masked_card.slice(-4)}` : null,
                    },
                },
                paymentAmount : midtransPaymentData.gross_amount,
                paymentFee    : 0,
            };
        }
        
        // case '300' :
        // case '400' :
        // case '500' :
        default    : {
            // TODO: log unexpected response
            console.log('unexpected response: ', midtransPaymentData);
            throw Error('unexpected API response');
        }
    } // switch
}