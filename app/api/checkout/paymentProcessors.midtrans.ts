// reusable-ui core:
import {
    decimalify,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// models:
import type {
    CreateOrderOptions,
    AuthorizedFundData,
    PaidFundData,
}                           from '@/models'



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
type MidtransPaymentOption =
    |'credit_card'
    |'qris'
type MidtransPaymentDetail<TPayment extends MidtransPaymentOption> =
    &{
        payment_type          : TPayment;
    }
    &{
        [payment in TPayment] : object;
    }
export const midtransCreateOrderGeneric  = async <TPayment extends MidtransPaymentOption>(midtransPaymentDetail: MidtransPaymentDetail<TPayment>, orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaidFundData|null> => {
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
            ...midtransPaymentDetail,
            
            transaction_details  : {
                order_id         : orderId,
                gross_amount     : totalCostConverted,
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
                    const paymentId    = midtransPaymentData.transaction_id;
                    const redirectData = midtransPaymentData.qr_string ?? midtransPaymentData.redirect_url;
                    if ((typeof(paymentId) !== 'string') || (typeof(redirectData) !== 'string') || !paymentId || !redirectData) {
                        // TODO: log unexpected response
                        console.log('unexpected response: ', midtransPaymentData);
                        throw Error('unexpected API response');
                    } // if
                    
                    
                    
                    // redirectData for 3DS verification:
                    return {
                        paymentId,
                        redirectData,
                    };
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
                    const paymentId   = midtransPaymentData.transaction_id;
                    if ((typeof(paymentId) !== 'string') || !paymentId) {
                        // TODO: log unexpected response
                        console.log('unexpected response: ', midtransPaymentData);
                        throw Error('unexpected API response');
                    } // if
                    
                    
                    
                    return {
                        paymentId,
                        redirectData : undefined, // no redirectData required but require a `midtransCaptureFund()` to capture the fund
                    };
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
export const midtransCreateOrderWithCard = async (cardToken: string, orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaidFundData|null> => {
    return midtransCreateOrderGeneric<'credit_card'>({
        payment_type         : 'credit_card',
        credit_card          : {
            token_id         : cardToken,
            authentication   : true,
            callback_type    : 'js_event',
            
            // features:
            type             : 'authorize',
        },
    }, orderId, options);
}
export const midtransCreateOrderWithQris = async (acquirer: 'gopay'|'airpay shopee', orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaidFundData|null> => {
    return midtransCreateOrderGeneric<'qris'>({
        payment_type         : 'qris',
        qris                 : {
            acquirer         : acquirer,
        },
    }, orderId, options);
    /*
    {
        status_code: '201',
        status_message: 'QRIS transaction is created',
        transaction_id: '0523d017-6097-4482-9140-10d22e628288',
        order_id: '5480522141858852',
        merchant_id: 'G551313466',
        gross_amount: '421000.00',
        currency: 'IDR',
        payment_type: 'qris',
        transaction_time: '2024-04-20 13:31:49',
        transaction_status: 'pending',
        fraud_status: 'accept',
            name: 'generate-qr-code',
            method: 'GET',
            url: 'https://api.sandbox.midtrans.com/v2/qris/0523d017-6097-4482-9140-10d22e628288/qr-code'
            }
        ],
        qr_string: '00020101021226620014COM.GO-JEK.WWW011993600914355131346650210G5513134660303UKE51440014ID.CO.QRIS.WWW0215AID4019422100900303UKE5204318553033605802ID5911Artswimwear6011TANAH BUMBU6105722755409421000.006247503661b2d76c-2e99-4d66-9228-9216b2920e530703A0163048BC5',
        acquirer: 'gopay',
        expiry_time: '2024-04-20 13:46:49'
    }
    */
}
export const midtransCaptureFund         = async (paymentId: string): Promise<PaidFundData|undefined> => {
    // const response = await fetch(`${midtransUrl}/v2/${encodeURIComponent(orderId)}/status`, {
    //     method  : 'GET',
    //     headers : {
    //         'Content-Type'    : 'application/json',
    //         'Accept'          : 'application/json',
    //         'Accept-Language' : 'en_US',
    //         'Authorization'   : `Basic ${midtransCreateAuthToken()}`,
    //     },
    // });
    const response = await fetch(`${midtransUrl}/v2/capture`, {
        method  : 'POST',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Basic ${midtransCreateAuthToken()}`,
        },
        body    : JSON.stringify({
            transaction_id    : paymentId,
        }),
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
            
            
            
            switch (midtransPaymentData.transaction_status) {
                // case 'authorize': {
                //     const paymentId   = midtransPaymentData.transaction_id;
                //     if ((typeof(paymentId) !== 'string') || !paymentId) {
                //         // TODO: log unexpected response
                //         console.log('unexpected response: ', midtransPaymentData);
                //         throw Error('unexpected API response');
                //     } // if
                //     
                //     
                //     
                //     return {
                //         paymentId,
                //         redirectData : undefined, // no redirectData required but require a `midtransCaptureFund()` to capture the fund
                //     };
                // }
                
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
export const midtransCancelOrder         = async (paymentId: string): Promise<boolean> => {
    const response = await fetch(`${midtransUrl}/v2/${encodeURIComponent(paymentId)}/cancel`, {
        method  : 'POST',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Basic ${midtransCreateAuthToken()}`,
        },
    });
    return response.ok;
}