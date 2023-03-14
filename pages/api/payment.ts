import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Product from '@/models/Product'



try {
    await connectDB(); // top level await
    console.log('connected to mongoDB!');
}
catch (error) {
    console.log('FAILED to connect mongoDB!');
    throw error;
} // try



const baseURL = {
    sandbox    : 'https://api-m.sandbox.paypal.com',
    production : 'https://api-m.paypal.com'
};
// const accessTokenExpiresThreshold = 0.5;
const paymentTokenExpiresThreshold = 0.5;



/**
 * Access token is used to authenticate all REST API requests.
 */
const generateAccessToken = async () => {
    const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
    const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
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
    const response    = await fetch(`${baseURL.sandbox}/v1/identity/generate-token`, {
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



export default async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    switch(req.method) {
        case 'GET': { // intialize paymentToken
            // if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            // } // if
            
            
            
            return res.status(200).json( // OK
                await generatePaymentToken(),
            );
        } break;
        case 'POST': { // place the order and calculate the total price (not relying priceList on the client_side)
            const body = req.body;
            
            
            
            console.log('TODO: calculating total order price...', body);
            const productList = await Product.findOne({ path: req.query.path }, { _id: true, name: true, price: true, shippingWeight: true });
            
            
            
            return res.status(200).json({ // OK
                id: 'order#1234',
            });
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
