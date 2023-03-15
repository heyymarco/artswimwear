import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Product from '@/models/Product'
import { createEntityAdapter } from '@reduxjs/toolkit';
import { calculateShippingCost } from '@/libs/utilities';
import Shipping from '@/models/Shipping';



try {
    await connectDB(); // top level await
    console.log('connected to mongoDB!');
}
catch (error) {
    console.log('FAILED to connect mongoDB!');
    throw error;
} // try



const basePaypalURL = {
    development : 'https://api-m.sandbox.paypal.com',
    production  : 'https://api-m.paypal.com'
};
const paypalURL = basePaypalURL.development; // TODO: auto switch development vs production
// const accessTokenExpiresThreshold = 0.5;
const paymentTokenExpiresThreshold = 0.5;



/**
 * Access token is used to authenticate all REST API requests.
 */
const generateAccessToken = async () => {
    const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
    const response = await fetch(`${paypalURL}/v1/oauth2/token`, {
        method  : 'POST',
        body    : 'grant_type=client_credentials',
        headers : {
            Authorization: `Basic ${auth}`,
        },
    });
    const data = await response.json();
    /*
        example:
        {
            scope: 'https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/vault/payment-tokens/read https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller Braintree:Vault https://uri.paypal.com/services/payments/refund https://api.paypal.com/v1/vault/credit-card https://api.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://uri.paypal.com/services/vault/payment-tokens/readwrite https://api.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks',
            access_token: 'A21AAJtSdh1lInhuRhSzhQrp35cEQ1Ew9imFtfvQmLCMDsBGdtCClFfWOp9p5pV4p1mkaA5Ota7KvHo7lleeyWF1nE0snjKBA',
            token_type: 'Bearer',
            app_id: 'APP-80W284485P519543T',
            expires_in: 32400, // seconds
            nonce: '2023-03-14T05:52:06Z8D_KHLLcduIuH9NK9MWNlskEse56LZtAEkvtDncxcEU'
        }
    */
    console.log('accessToken created!');
    // console.log('accessToken: ', data);
    if (!data || data.error) throw data?.error_description ?? data?.error ?? Error('Fetch access token failed.');
    return data.access_token;
}

/**
 * Call this function to create your client token (paymentToken).
 */
const generatePaymentToken = async () => {
    const accessToken = await generateAccessToken();
    const response    = await fetch(`${paypalURL}/v1/identity/generate-token`, {
        method  : 'POST',
        headers : {
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language' : 'en_US',
            'Content-Type'    : 'application/json',
        },
    });
    const data = await response.json();
    /*
        example:
        {
            client_token: 'eyJicmFpbnRyZWUiOnsiYXV0aG9yaXphdGlvbkZpbmdlcnByaW50IjoiMjY4ZTg0NmMxNjllMzlkYjg2Zjk0ZGE4YWYzYzIxZTc3Y2VlNjBlYmJkZWY2NDM0YzZkZmI4YTg3NjMwYzkzMHxtZXJjaGFudF9pZD1yd3dua3FnMnhnNTZobTJuJnB1YmxpY19rZXk9NjNrdm4zN3Z0MjlxYjRkZiZjcmVhdGVkX2F0PTIwMjMtMDMtMTRUMDU6NTI6MDcuMjY2WiIsInZlcnNpb24iOiIzLXBheXBhbCJ9LCJwYXlwYWwiOnsiaWRUb2tlbiI6bnVsbCwiYWNjZXNzVG9rZW4iOiJBMjFBQUx0cnZYRnJ6MnZnRXZHWFdrc096RGU3WGVDQUlzR2ZTSHlIRHgwNUdzTVdwOTZDLXFFRUtwT1RpN2hUczNCUFRoYm4zZTl3Y09iVnh4Y2tJLWxkZ1llMGw0aFZBIn19',
            expires_in: 3600, // seconds
        }
    */
    console.log('paymentToken created!');
    // console.log('paymentToken: ', data);
    if (!data || data.error) throw data?.error_description ?? data?.error ?? Error('Fetch paymentToken failed.');
    return {
        paymentToken : data.client_token,
        expires      : Date.now() + ((data.expires_in ?? 3600) * 1000 * paymentTokenExpiresThreshold)
    };
}

const handlePaypalResponse = async (response: Response) => {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    } // if
    
    
    
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}



export default async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    switch(req.method) {
        case 'GET': { // intialize paymentToken
            if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            } // if
            
            
            
            return res.status(200).json( // OK
                await generatePaymentToken(),
            );
        } break;
        case 'POST': { // place the order and calculate the total price (not relying priceList on the client_side)
            const data = req.body;
            if (typeof(data) !== 'object') return res.status(400).end(); // bad req
            
            
            
            // validate shipping address:
            const {
                marketingOpt = true,
                
                shippingFirstName,
                shippingLastName,
                
                shippingPhone,
                shippingEmail,
                
                shippingCountry,
                shippingAddress,
                shippingCity,
                shippingZone,
                shippingZip,
                
                shippingProvider,
            } = data;
            if (
                (typeof(marketingOpt) !== 'boolean')
                
                || !shippingFirstName || (typeof(shippingFirstName) !== 'string')
                || !shippingLastName  || (typeof(shippingLastName) !== 'string')
                
                || !shippingPhone     || (typeof(shippingPhone) !== 'string')
                || !shippingEmail     || (typeof(shippingEmail) !== 'string') // todo validate email
                
                || !shippingCountry   || (typeof(shippingCountry) !== 'string') // todo validate country id
                || !shippingAddress   || (typeof(shippingAddress) !== 'string')
                || !shippingCity      || (typeof(shippingCity) !== 'string')
                || !shippingZone      || (typeof(shippingZone) !== 'string')
                || !shippingZip       || (typeof(shippingZip) !== 'string')
                
                || !shippingProvider  || (typeof(shippingProvider) !== 'string') // todo validate shipping provider
            ) {
                return res.status(400).end(); // bad req
            } // if
            const selectedShipping = await Shipping.findOne({
                _id: shippingProvider,
                enabled: true,
            }, { _id: false, weightStep: true, shippingRates: true });
            if (!selectedShipping) return res.status(400).end(); // bad req
            
            
            
            // validate cart items + calculate total prices + calculate shipping cost
            const items = data.items;
            if (!items || !Array.isArray(items) || !items.length) return res.status(400).end(); // bad req
            
            interface ProductEntry {
                _id             : string
                price           : number
                shippingWeight ?: number
            }
            const productListAdapter = createEntityAdapter<ProductEntry>({
                selectId : (productEntry) => productEntry._id,
            });
            const productList = productListAdapter.addMany(
                productListAdapter.getInitialState(),
                await Product.find({}, { _id: true, price: true, shippingWeight: true })
            );
            
            let totalProductPrices = 0, totalProductWeights = 0;
            for (const item of items) {
                if (!item || (typeof(item) !== 'object')) return res.status(400).end(); // bad req
                const {
                    productId,
                    quantity,
                } = item;
                if (!productId || (typeof(productId) !== 'string')) return res.status(400).end(); // bad req
                if (!quantity || (typeof(quantity) !== 'number') || !isFinite(quantity) || (quantity < 0)) return res.status(400).end(); // bad req
                
                const productUnitPrice  = productList.entities[productId]?.price;
                const productUnitWeight = productList.entities[productId]?.shippingWeight;
                
                totalProductPrices  += productUnitPrice  ?? 0;
                totalProductWeights += productUnitWeight ?? 0;
            } // for
            const totalShippingCosts = calculateShippingCost(totalProductWeights, selectedShipping);
            const totalCost = totalProductPrices + (totalShippingCosts ?? 0);
            
            
            
            const accessToken = await generateAccessToken();
            const url = `${paypalURL}/v2/checkout/orders`;
            const paypalResponse = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            amount: {
                                currency_code: "USD",
                                value: totalCost, // TODO: convert idr to usd
                            },
                        },
                    ],
                }),
            });
            try {
                const paypalData = await handlePaypalResponse(paypalResponse);
                /*
                    example:
                    {
                        id: '4AM48902TR915910H',
                        status: 'CREATED',
                        links: [
                            {
                                href: 'https://api.sandbox.paypal.com/v2/checkout/orders/4AM48902TR915910H',
                                rel: 'self',
                                method: 'GET'
                            },
                            {
                                href: 'https://www.sandbox.paypal.com/checkoutnow?token=4AM48902TR915910H',
                                rel: 'approve',
                                method: 'GET'
                            },
                            {
                                href: 'https://api.sandbox.paypal.com/v2/checkout/orders/4AM48902TR915910H',
                                rel: 'update',
                                method: 'PATCH'
                            },
                            {
                                href: 'https://api.sandbox.paypal.com/v2/checkout/orders/4AM48902TR915910H/capture',
                                rel: 'capture',
                                method: 'POST'
                            }
                        ]
                    }
                */
                console.log('paypalData: ', paypalData);
                return res.status(200).json(paypalData); // OK
            }
            catch (error: any) {
                return res.status(500).send(error?.message ?? error ?? 'error');
            } // try
        } break;
        case 'PATCH': { // purchase the previously posted order
            const body = req.body;
            
            console.log('TODO: capturing the payment...', body);
            
            return res.status(200).end(); // OK
        } break;
        default:
            return res.status(400).end();
    } // switch
};
