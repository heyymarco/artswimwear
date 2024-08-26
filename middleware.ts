// next-js:
import {
    type NextRequest,
}                           from 'next/server'



export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith('/wp-')) {
        return new Response(undefined, {
            status : 404,
        });
    } // if
    if (pathname.endsWith('.php')) {
        return new Response(undefined, {
            status : 404,
        });
    } // if
}
