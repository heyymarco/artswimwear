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
export interface ProductPreview
    extends
        Pick<Product,
            |'id'
            |'name'
            |'price'
            |'shippingWeight'
            |'path'
        >
{
    image: Required<Product>['images'][number]|undefined
}
export interface ProductDetail
    extends
        Pick<Product,
            |'id'
            |'name'
            |'price'
            |'path'
            |'excerpt'
            |'description'
            |'images'
        >
{
}



const router = createRouter<
    NextApiRequest,
    NextApiResponse<
        |ProductDetail|null
        |Array<ProductPreview>
        |{ error: string }
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
    
    
    
    if (req.query.path) {
        return res.json(
            await prisma.product.findUnique({
                where  : {
                    path       : req.query.path.toString(),   // find by url path
                    visibility : { not: 'DRAFT' }, // allows access to Product with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
                },
                select : {
                    id          : true,
                    
                    name        : true,
                    
                    price       : true,
                    
                    path        : true,
                    
                    excerpt     : true,
                    description : true,
                    
                    images      : true,
                },
            })
        );
    } // if
    
    
    
    return res.json(
        (await prisma.product.findMany({
            where  : {
                visibility: 'PUBLISHED', // allows access to Product with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
            },
            select : {
                id             : true,
                
                name           : true,
                
                price          : true,
                shippingWeight : true,
                
                path           : true,
                
                images         : true,
            },
        }))
        .map((product) => {
            const {
                images, // take
            ...restProduct} = product;
            return {
                ...restProduct,
                image : images?.[0]
            };
        })
    );
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
