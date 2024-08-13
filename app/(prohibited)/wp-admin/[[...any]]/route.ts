// configs:
export const dynamic = 'force-static';



// routers:
const handler = async () => {
    return new Response(undefined, {
        status : 404,
    });
}
export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as HEAD,
    handler as OPTIONS,
}
