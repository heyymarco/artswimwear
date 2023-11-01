// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

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



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    handler as GET,
    // handler as POST,
    // handler as PUT,
    // handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
}

router
.get(async (req) => {
    /* required for displaying related_products in orders page */
    
    
    
    //#region parsing request
    const path = req.nextUrl.searchParams.get('path');
    //#endregion parsing request
    
    
    
    if (path) {
        const productDetail : ProductDetail|null = (
            await prisma.product.findUnique({
                where  : {
                    path       : path, // find by url path
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
        
        if (!productDetail) {
            return NextResponse.json({
                error: `The product with specified path "${path}" is not found.`,
            }, { status: 404 }); // handled with error
        } // if
        
        return NextResponse.json(productDetail); // handled with success
    } // if
    
    
    
    const productPreviews : ProductPreview[] = (
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
    return NextResponse.json(productPreviews); // handled with success
});
