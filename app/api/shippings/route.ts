// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import {
    type ShippingPreview,
    
    
    
    // utilities:
    shippingPreviewSelect,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<Request, RequestContext>();
const handler = async (req: Request, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as HEAD,
}

router
.get(async () => {
    /* required for displaying related_shippings in orders page */
    
    
    
    const shippingPreviews : Array<ShippingPreview> = (
        await prisma.shippingProvider.findMany({
            select: shippingPreviewSelect,
        }) // get all shippings including the disabled ones
    );
    return Response.json(shippingPreviews); // handled with success
});
