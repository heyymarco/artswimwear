// reusable-ui core:
import {
    decimalify,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

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
export const midtransCreateOrder = async (midtransPaymentToken: string, orderId: string, options: CreateOrderOptions): Promise<CaptureFundData|null|string> => {
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
            item_details         : [
                ...detailedItems.map((detailedItem) => ({
                    name             : detailedItem.productName + (!detailedItem.variantNames.length ? '' : ` (${detailedItem.variantNames.join(', ')})`),
                    price            : detailedItem.priceConverted,
                    quantity         : detailedItem.quantity,
                })),
                ...((totalShippingCostConverted === null) ? [] : [{
                    name     : 'Shipping',
                    price    : totalShippingCostConverted,
                    quantity : 1,
                }]),
            ],
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
            
            
            
            switch (midtransPaymentData.fraud_status) {
                case 'accept': {
                    const redirectUrl = midtransPaymentData.redirect_url;
                    if (typeof(redirectUrl) !== 'string') {
                        // TODO: log unexpected response
                        console.log('unexpected response: ', midtransPaymentData);
                        throw Error('unexpected API response');
                    } // if
                    
                    
                    
                    // redirectUrl for 3DS verification:
                    return redirectUrl;
                }
                
                case 'challenge': { // The transaction is successfully sent to the bank but yet to be approved
                    // assumes as denied:
                    return null;
                }
                
                default : {
                    // TODO: log unexpected response
                    console.log('unexpected response: ', midtransPaymentData);
                    throw Error('unexpected API response');
                }
            } // switch
        }
        case '200' : {
            // Capture Notification after submit OTP 3DS 2.0
            // Capture Notification
            // Settlement Notification
            
            
            
            switch (midtransPaymentData.transaction_status) {
                case 'authorize': {
                    return ''; // no redirectUrl required but require a `midtransCaptureFund()` to capture the fund
                }
                
                case 'capture':
                case 'settlement': {
                    let paymentAmountRaw = midtransPaymentData.gross_amount;
                    const paymentAmount  = decimalify(
                        (typeof(paymentAmountRaw) === 'number')
                        ? paymentAmountRaw
                        : Number.parseFloat(paymentAmountRaw)
                    );
                    return {
                        paymentSource : {
                            card : (midtransPaymentData.payment_type !== 'credit_card') ? undefined : {
                                type       : 'CARD',
                                brand      : midtransPaymentData.bank?.toLowerCase() ?? null,
                                identifier : midtransPaymentData.masked_card ? `ending with ${midtransPaymentData.masked_card.slice(-4)}` : null,
                            },
                        },
                        paymentAmount : paymentAmount,
                        paymentFee    : 0,
                    };
                }
                
                default : {
                    // TODO: log unexpected response
                    console.log('unexpected response: ', midtransPaymentData);
                    throw Error('unexpected API response');
                }
            } // switch
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
export const midtransVerifyFund  = async (orderId: string): Promise<CaptureFundData|null|undefined> => {
    const response = await fetch(`${midtransUrl}/v2/${encodeURIComponent(orderId)}/status?`, {
        method  : 'GET',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Basic ${midtransCreateAuthToken()}`,
        },
    });
    const midtransPaymentData = await midtransHandleResponse(response);
    switch (`${midtransPaymentData.status_code}` /* stringify */) {
        case '404': {
            // NotFound Notification
            
            
            
            return undefined;
        }
        case '200' : {
            // Capture Notification after submit OTP 3DS 2.0
            // Capture Notification
            // Settlement Notification
            if (!['capture', 'authorize'].includes(midtransPaymentData.transaction_status)) return null; // Deny
            
            
            
            let paymentAmountRaw = midtransPaymentData.gross_amount;
            const paymentAmount  = decimalify(
                (typeof(paymentAmountRaw) === 'number')
                ? paymentAmountRaw
                : Number.parseFloat(paymentAmountRaw)
            );
            return {
                paymentSource : {
                    card : (midtransPaymentData.payment_type !== 'credit_card') ? undefined : {
                        type       : 'CARD',
                        brand      : midtransPaymentData.bank?.toLowerCase() ?? null,
                        identifier : midtransPaymentData.masked_card ? `ending with ${midtransPaymentData.masked_card.slice(-4)}` : null,
                    },
                },
                paymentAmount : paymentAmount,
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