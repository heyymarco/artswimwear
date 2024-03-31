// types:
export interface PaypalPaymentToken {
    paymentToken : string
    expiresAt    : number
    refreshAt    : number
}



// utilities:
const paypalBaseUrl = {
    development : 'https://api-m.sandbox.paypal.com',
    production  : 'https://api-m.paypal.com',
};
export const paypalUrl = paypalBaseUrl.development; // TODO: auto switch development vs production



/**
 * Access token is used to authenticate all REST API requests.
 */
export const paypalGenerateAccessToken  = async () => {
    const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
    const response = await fetch(`${paypalUrl}/v1/oauth2/token`, {
        method  : 'POST',
        body    : 'grant_type=client_credentials',
        headers : {
            Authorization: `Basic ${auth}`,
        },
    });
    const accessTokenData = await response.json();
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
    console.log('created: accessTokenData');
    // console.log('created: accessTokenData: ', accessTokenData);
    if (!accessTokenData || accessTokenData.error) throw accessTokenData?.error_description ?? accessTokenData?.error ?? Error('Fetch access token failed.');
    return accessTokenData.access_token;
}

const paypalPaymentTokenExpiresThreshold = 0.5;
/**
 * Call this function to create your client token (paymentToken).
 */
export const paypalGeneratePaymentToken = async (): Promise<PaypalPaymentToken> => {
    const response    = await fetch(`${paypalUrl}/v1/identity/generate-token`, {
        method  : 'POST',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Bearer ${await paypalGenerateAccessToken()}`,
        },
    });
    const paymentTokenData = await response.json();
    /*
        example:
        {
            client_token: 'eyJicmFpbnRyZWUiOnsiYXV0aG9yaXphdGlvbkZpbmdlcnByaW50IjoiMjY4ZTg0NmMxNjllMzlkYjg2Zjk0ZGE4YWYzYzIxZTc3Y2VlNjBlYmJkZWY2NDM0YzZkZmI4YTg3NjMwYzkzMHxtZXJjaGFudF9pZD1yd3dua3FnMnhnNTZobTJuJnB1YmxpY19rZXk9NjNrdm4zN3Z0MjlxYjRkZiZjcmVhdGVkX2F0PTIwMjMtMDMtMTRUMDU6NTI6MDcuMjY2WiIsInZlcnNpb24iOiIzLXBheXBhbCJ9LCJwYXlwYWwiOnsiaWRUb2tlbiI6bnVsbCwiYWNjZXNzVG9rZW4iOiJBMjFBQUx0cnZYRnJ6MnZnRXZHWFdrc096RGU3WGVDQUlzR2ZTSHlIRHgwNUdzTVdwOTZDLXFFRUtwT1RpN2hUczNCUFRoYm4zZTl3Y09iVnh4Y2tJLWxkZ1llMGw0aFZBIn19',
            expires_in: 3600, // seconds
        }
    */
    console.log('created: paymentTokenData');
    // console.log('created: paymentTokenData: ', paymentTokenData);
    if (!paymentTokenData || paymentTokenData.error) throw paymentTokenData?.error_description ?? paymentTokenData?.error ?? Error('Fetch paymentToken failed.');
    
    const expiresIn = (paymentTokenData.expires_in ?? 3600) * 1000;
    return {
        paymentToken : paymentTokenData.client_token,
        expiresAt    : Date.now() +  expiresIn,
        refreshAt    : Date.now() + (expiresIn * paypalPaymentTokenExpiresThreshold),
    };
}

export const paypalHandleResponse       = async (response: Response) => {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    } // if
    
    
    
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}