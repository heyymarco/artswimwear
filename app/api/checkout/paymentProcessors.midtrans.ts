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



const midtransCreateAuthToken = () => {
    const auth = Buffer.from(`${process.env.MIDTRANS_ID}:`).toString('base64');
    return auth;
}
export const midtransCaptureFund = async (midtransPaymentToken: string, options: CreateOrderOptions): Promise<CaptureFundData|null> => {
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
                order_id         : 'C17550', // TODO
                gross_amount     : totalCostConverted,
            },
            credit_card          : {
                token_id         : midtransPaymentToken,
            },
            item_details         : detailedItems.map((detailedItem) => ({
                name             : detailedItem.productName + (!detailedItem.variantNames.length ? '' : `(${detailedItem.variantNames.join(', ')})`),
                price            : detailedItem.priceConverted,
                quantity         : detailedItem.quantity,
            })),
            customer_details     : {
                first_name       : shippingFirstName,
                last_name        : shippingLastName,
                email            : 'test@midtrans.com', // TODO
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
}