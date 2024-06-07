// reusable-ui core:
import {
    decimalify,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// models:
import {
    // types:
    type CreateOrderOptions,
    type AuthorizedFundData,
    type PaymentDetail,
    
    
    
    // utilities:
    isAuthorizedFundData,
}                           from '@/models'

// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// utilities:
const midtransBaseUrl = {
    development : 'https://api.sandbox.midtrans.com',
    production  : 'https://api.midtrans.com',
};
const midtransUrl = midtransBaseUrl.development; // TODO: auto switch development vs production



/**
 * undefined          : Transaction not found.  
 * null               : Transaction creation was denied.  
 * AuthorizedFundData : Authorized for payment.  
 * PaymentDetail      : Paid.  
 * false              : Transaction was deleted due to canceled or expired.  
 */
export const midtransTranslateData = (midtransPaymentData: any): undefined|null|AuthorizedFundData|PaymentDetail|false => {
    switch (`${midtransPaymentData.status_code}` /* stringify */) {
        case '404' : {
            // Transaction not found
            
            
            
            return undefined;
        }
        
        
        
        case '202' : {
            // Transaction creation was denied
            
            
            
            switch (midtransPaymentData.transaction_status) {
                /* handle inconsistent status_code <==> transaction_status */
                case 'cancel':
                case 'expire': {
                    // Transaction was deleted due to canceled or expired:
                    return false;
                }
                
                
                
                default:
                    // Transaction creation was denied
                    return null;
            } // switch
        }
        
        
        
        case '201' : {
            // Operation is success but not yet paid
            // -or-
            // Challenge notification
            
            
            
            switch (midtransPaymentData.fraud_status) {
                case undefined :
                case 'accept'  : {
                    switch (midtransPaymentData.transaction_status) {
                        case 'pending': {
                            const paymentId    = midtransPaymentData.transaction_id;
                            if ((typeof(paymentId) !== 'string') || !paymentId) {
                                console.log('unexpected response: ', midtransPaymentData);
                                throw Error('unexpected API response');
                            } // if
                            
                            const paymentCode  = midtransPaymentData.payment_code;
                            
                            const redirectData = (
                                midtransPaymentData.qr_string
                                ??
                                midtransPaymentData.redirect_url
                                ??
                                ((): string|undefined => {
                                    const actions = midtransPaymentData.actions;
                                    if (!Array.isArray(actions)) return undefined;
                                    return (
                                        actions
                                        .find((action) => (action.name === 'deeplink-redirect'))
                                        ?.url
                                    );
                                })()
                            );
                            console.log('QR code: ', midtransPaymentData.actions?.[0]?.url);
                            if ((redirectData !== undefined) && ((typeof(redirectData) !== 'string') || !redirectData)) {
                                console.log('unexpected response: ', midtransPaymentData);
                                throw Error('unexpected API response');
                            } // if
                            console.log('redirectData: ', redirectData);
                            
                            let expiresStr = midtransPaymentData.expiry_time;
                            if (expiresStr && (typeof(expiresStr) === 'string')) {
                                if (!(/Z|[T+-]\d{2}:\d{2}/i).test(expiresStr)) { // no timezone defined => assumes as GMT+7
                                    expiresStr += '+07:00';
                                } // if
                            } // if
                            const expiresNum = !expiresStr ? NaN : Date.parse(expiresStr);
                            const expires = isNaN(expiresNum) ? undefined : new Date(expiresNum);
                            
                            
                            
                            return {
                                paymentId,
                                paymentCode,
                                redirectData, // redirectData for 3DS verification (credit_card) // undefined for gopay, shopeepay
                                expires,
                            } satisfies AuthorizedFundData;
                        }
                        
                        
                        
                        // case 'capture'   :
                        // case 'settlement': {
                        //     // should not happended with status_code 201
                        //     
                        //     
                        //     
                        //     console.log('unexpected response: ', midtransPaymentData);
                        //     throw Error('unexpected API response');
                        // }
                        
                        
                        
                        case 'cancel':
                        case 'expire': {
                            // Transaction was deleted due to canceled or expired:
                            return false;
                        }
                        
                        
                        
                        default: {
                            console.log('unexpected response: ', midtransPaymentData);
                            throw Error('unexpected API response');
                        }
                    } // switch
                }
                
                
                
                case 'challenge': { // The transaction is successfully sent to the bank but yet to be approved
                    // (rarely case) assumes as denied:
                    return null;
                }
                
                
                
                default : {
                    console.log('unexpected response: ', midtransPaymentData);
                    throw Error('unexpected API response');
                }
            } // switch
        }
        
        
        
        case '200' : {
            // Operation is Success and has been paid
            // Capture Notification after submit OTP 3DS 2.0
            // Capture Notification
            // Settlement Notification
            
            
            
            switch (midtransPaymentData.transaction_status) {
                case 'authorize': {
                    const paymentId = midtransPaymentData.transaction_id;
                    if ((typeof(paymentId) !== 'string') || !paymentId) {
                        console.log('unexpected response: ', midtransPaymentData);
                        throw Error('unexpected API response');
                    } // if
                    
                    
                    
                    // Ready to be captured:
                    return {
                        paymentId,
                        redirectData : undefined, // no redirectData required but require a `midtransCaptureFund()` to capture the fund
                    } satisfies AuthorizedFundData;
                }
                
                
                
                case 'capture'   :
                case 'settlement': {
                    let amountRaw = midtransPaymentData.gross_amount;
                    const amount  = decimalify(
                        (typeof(amountRaw) === 'number')
                        ? amountRaw
                        : Number.parseFloat(amountRaw)
                    );
                    
                    
                    
                    const paymentDetailPartial = ((): Pick<PaymentDetail, 'type'|'brand'|'identifier'> => {
                        switch (midtransPaymentData.payment_type) {
                            /* PAY WITH CARD */
                            case 'credit_card': return {
                                type       : 'CARD',
                                brand      : midtransPaymentData.bank ?? null,
                                identifier : midtransPaymentData.masked_card ? `ending with ${midtransPaymentData.masked_card.slice(-4)}` : null,
                            };
                            
                            
                            
                            /* PAY WITH EWALLET */
                            case 'gopay'    :
                            case 'shopeepay':
                            case 'qris'     : return {
                                type       : 'EWALLET',
                                brand      : midtransPaymentData.issuer ?? midtransPaymentData.acquirer ?? midtransPaymentData.payment_type ?? null,
                                // identifier : midtransPaymentData.merchant_id ?? null,
                                identifier : null,
                            };
                            
                            
                            
                            /* PAY WITH CSTORE */
                            case 'cstore': return {
                                type       : 'MANUAL_PAID',
                                brand      : midtransPaymentData.store,
                                identifier : midtransPaymentData.payment_code,
                            };
                            
                            
                            
                            /* PAY WITH OTHER */
                            default : return {
                                type       : 'CUSTOM',
                                brand      : null,
                                identifier : null,
                            };
                        } // switch
                    })();
                    return {
                        ...paymentDetailPartial,
                        
                        amount : amount,
                        fee    : ((): number => {
                            const vat = (amount * (11 / 100)); // VAT is 11%
                            
                            
                            
                            let mdrFee = 0;
                            switch (paymentDetailPartial.type) {
                                case 'CARD':
                                    mdrFee = (amount * (2.9 / 100)) + 2000; // 2.9% + Rp2000
                                    break;
                                
                                case 'EWALLET':
                                    mdrFee = (amount * (0.7 / 100)); // 0.7% + Rp2000
                                    break;
                            } // switch
                            
                            
                            
                            const totalFeeRaw  = (vat + mdrFee);
                            const fractionUnit = checkoutConfigServer.intl.currencies.IDR.fractionUnit
                            const rounding     = {
                                ROUND : Math.round,
                                CEIL  : Math.ceil,
                                FLOOR : Math.floor,
                            }[checkoutConfigServer.intl.currencyConversionRounding]; // reverts using app's currencyConversionRounding (usually ROUND)
                            const fractions       = rounding(totalFeeRaw / fractionUnit);
                            const totalFeeStepped = fractions * fractionUnit;
                            return trimNumber(totalFeeStepped); // decimalize summed numbers to avoid producing ugly_fractional_decimal
                        })(),
                    } satisfies PaymentDetail;
                }
                
                
                
                default : {
                    console.log('unexpected response: ', midtransPaymentData);
                    throw Error('unexpected API response');
                }
            } // switch
        }
        
        
        
        // case '300' :
        // case '400' :
        // case '500' :
        default    : {
            console.log('unexpected response: ', midtransPaymentData);
            throw Error('unexpected API response');
        }
    } // switch
}



const midtransCreateAuthToken = () => {
    const auth = Buffer.from(`${process.env.MIDTRANS_ID}:`).toString('base64');
    return auth;
}
const midtransHandleResponse  = async (response: Response) => {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    } // if
    
    
    
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}



type MidtransPaymentOption =
    |'credit_card'
    |'qris'
    |'gopay'
    |'shopeepay'
    |'cstore'
type MidtransPaymentDetail<TPayment extends MidtransPaymentOption> =
    &{
        payment_type          : TPayment;
    }
    &{
        [payment in TPayment] : object;
    }
export const midtransCreateOrderGeneric       = async <TPayment extends MidtransPaymentOption>(midtransPaymentDetail: MidtransPaymentDetail<TPayment>, orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaymentDetail|null> => {
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
    const result = midtransTranslateData(midtransPaymentData);
    switch (result) {
        case undefined :   // Transaction not found.
        case false     : { // Transaction was deleted due to canceled or expired.
            console.log('unexpected response: ', midtransPaymentData);
            throw Error('unexpected API response');
        }
        
        
        
        default:
            // null               : Transaction creation was denied.
            // AuthorizedFundData : Authorized for payment.
            // PaymentDetail      : Paid.
            return result;
    } // switch
}
export const midtransCreateOrderWithCard      = async (cardToken: string, orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaymentDetail|null> => {
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
export const midtransCreateOrderWithQris      = async (orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaymentDetail|null> => {
    return midtransCreateOrderGeneric<'qris'>({
        payment_type         : 'qris',
        qris                 : {
            // acquirer         : acquirer,
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
export const midtransCreateOrderWithGopay     = async (orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaymentDetail|null> => {
    return midtransCreateOrderGeneric<'gopay'>({
        payment_type         : 'gopay',
        gopay                : {
            enable_callback  : true,
            callback_url     : `${process.env.APP_URL}/checkout?orderId=${encodeURIComponent(orderId)}`,
        },
    }, orderId, options);
    /*
    {
        status_code: '201',
        status_message: 'GO-PAY billing created',
        transaction_id: 'e48447d1-cfa9-4b02-b163-2e915d4417ac',
        order_id: 'SAMPLE-ORDER-ID-01',
        gross_amount: '10000.00',
        payment_type: 'gopay',
        transaction_time: '2017-10-04 12:00:00',
        transaction_status: 'pending',
        actions: [
            {
                name: 'generate-qr-code',
                method: 'GET',
                url: 'https://api.midtrans.com/v2/gopay/e48447d1-cfa9-4b02-b163-2e915d4417ac/qr-code'
            },
            {
                name: 'deeplink-redirect',
                method: 'GET',
                url: 'gojek://gopay/merchanttransfer?tref=1509110800474199656LMVO&amount=10000&activity=GP:RR&callback_url=someapps://callback?order_id=SAMPLE-ORDER-ID-01'
            },
            {
                name: 'get-status',
                method: 'GET',
                url: 'https://api.midtrans.com/v2/e48447d1-cfa9-4b02-b163-2e915d4417ac/status'
            },
            {
                name: 'cancel',
                method: 'POST',
                url: 'https://api.midtrans.com/v2/e48447d1-cfa9-4b02-b163-2e915d4417ac/cancel',
                fields: []
            }
        ],
        channel_response_code: '200',
        channel_response_message: 'Success',
        currency: 'IDR'
    }
    */
}
export const midtransCreateOrderWithShopeepay = async (orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaymentDetail|null> => {
    return midtransCreateOrderGeneric<'shopeepay'>({
        payment_type         : 'shopeepay',
        shopeepay            : {
            callback_url     : `${process.env.APP_URL}/checkout?orderId=${encodeURIComponent(orderId)}`,
        },
    }, orderId, options);
    /*
    {
        status_code: '201',
        status_message: 'ShopeePay transaction is created',
        channel_response_code: '0',
        channel_response_message: 'success',
        transaction_id: 'bb379c3a-218b-47c7-9b0b-25f71f0f1231',
        order_id: 'test-order-shopeepay-001',
        merchant_id: 'YON001',
        gross_amount: '25000.00',
        currency: 'IDR',
        payment_type: 'shopeepay',
        transaction_time: '2020-09-29 11:16:23',
        transaction_status: 'pending',
        fraud_status: 'accept',
        actions: [
            {
                name: 'deeplink-redirect',
                method: 'GET',
                url: 'https://wsa.uat.wallet.airpay.co.id/universal-link/wallet/pay?deep_and_deferred=1&token=dFhkbmR1bTBIamhW5n7WPz2OrczCvb8_XiHliB9nROFMVByjtwKMAl6G0Ax0cMr79M4hwjs'
            }
        ]
    }
    */
}
export const midtransCreateOrderWithIndomaret = async (orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaymentDetail|null> => {
    return midtransCreateOrderGeneric<'cstore'>({
        payment_type         : 'cstore',
        cstore               : {
            store            : 'indomaret',
        },
        // @ts-ignore
        custom_expiry        : {
            unit             : 'second',
            expiry_duration  : Math.round(checkoutConfigServer.payment.expires.cstore * 24 * 60 * 60 /* converts days to seconds */),
        },
    }, orderId, options);
    /*
    {
        status_code: '201',
        status_message: 'Success, cstore transaction is successful',
        transaction_id: 'e3f0b1b5-1941-4ffb-9083-4ee5a96d878a',
        order_id: 'order04',
        gross_amount: '162500.00',
        payment_type: 'cstore',
        transaction_time: '2016-06-19 17:18:07',
        transaction_status: 'pending',
        payment_code: '25709650945026',
        expiry_time: '2017-01-09 09:56:44'
    }
    */
}
export const midtransCreateOrderWithAlfamart  = async (orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaymentDetail|null> => {
    return midtransCreateOrderGeneric<'cstore'>({
        payment_type         : 'cstore',
        cstore               : {
            store            : 'alfamart',
        },
        // @ts-ignore
        custom_expiry        : {
            unit             : 'second',
            expiry_duration  : Math.round(checkoutConfigServer.payment.expires.cstore * 24 * 60 * 60 /* converts days to seconds */),
        },
    }, orderId, options);
    /*
    {
        status_code: '201',
        status_message: 'Success, cstore transaction is successful',
        transaction_id: 'f1d381f8-7519-4139-b28f-81c6b3dc38ea',
        order_id: 'order05',
        gross_amount: '10500.00',
        payment_type: 'cstore',
        transaction_time: '2016-06-28 16:22:49',
        transaction_status: 'pending',
        fraud_status: 'accept',
        payment_code: '010811223344',
        store: 'alfamart'
    }
    */
}



export const midtransCaptureFund          = async (paymentId: string): Promise<PaymentDetail|undefined> => {
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
    const result = midtransTranslateData(midtransPaymentData);
    switch (result) {
        case null      :   // Transaction creation was denied.
        case false     : { // Transaction was deleted due to canceled or expired.
            console.log('unexpected response: ', midtransPaymentData);
            throw Error('unexpected API response');
        }
        
        
        
        default:
            if (isAuthorizedFundData(result)) {
                // AuthorizedFundData : Authorized for payment.
                console.log('unexpected response: ', midtransPaymentData);
                throw Error('unexpected API response');
            } // if
            
            
            
            // undefined     : Transaction not found.
            // PaymentDetail : Paid.
            return result;
    } // switch
}



export const midtransCancelOrder          = async (paymentId: string): Promise<boolean> => {
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