import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

// models:
import type {
    Product,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// types:
export interface PricePreview
    extends
        Pick<Product,
            |'id'
            |'price'
            |'shippingWeight'
        >
{
}



const router = createRouter<
    NextApiRequest,
    NextApiResponse<
        | Array<PricePreview>
        | { error: string }
    >
>();



router
.get(async (req, res) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    const priceList = await prisma.product.findMany({
        where  : {
            visibility : { not: 'DRAFT' }, // allows access to Product with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
        },
        select : {
            id             : true,
            price          : true,
            shippingWeight : true,
        },
    });
    return res.json(priceList);
});



export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
});
