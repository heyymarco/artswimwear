// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Stripe from 'stripe'


// try {
//     await connectDB(); // top level await
//     console.log('connected to mongoDB!');
// }
// catch (error) {
//     console.log('FAILED to connect mongoDB!');
//     throw error;
// } // try



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2022-11-15' });



export default async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    switch(req.method) {
        case 'PUT':
            // if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            // } // if
            
            
            
            const requestJson = req.body && (typeof(req.body) === 'object') ? req.body : undefined;
            if (requestJson instanceof Error) return res.status(400).end(); // bad req JSON
            
            
            
            const prevPaymentId = requestJson?.paymentId;
            if (requestJson) console.log('request JSON: ', requestJson);
            
            
            
            // // simulates a payment failed:
            // return res.status(200).json({
            //     paymentId : prevPaymentId,
            //     failed    : 'payment declined',
            // });
            
            
            
            const payment = (
                // get the prev paymentIntent (if any):
                (
                    !prevPaymentId
                    ? undefined
                    : await stripe.paymentIntents.retrieve(prevPaymentId)
                )
                ??
                // create a new paymentIntent:
                await stripe.paymentIntents.create({
                    description : `Payment at ${new Date().toISOString()}`,
                    
                    amount : 123,
                    currency: 'usd',
                    payment_method_types : ['card'],
                    setup_future_usage: 'on_session', // on_session : charge immediately // off_session : (may charge immediately) and re-charges in the future (saved payment)
                    // metadata: {order_id: '6735'}, // not yet implemented
                })
            );
            return res.status(200).json({
                paymentId     : payment.id,
                client_secret : payment.client_secret,
            });
            
            
            
        default:
            return res.status(400).end();
    } // switch
};
