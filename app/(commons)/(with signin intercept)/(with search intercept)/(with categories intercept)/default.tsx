'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// pages:
import {
    CategoryPageContent,
}                           from '@/app/(commons)/(with signin intercept)/(with search intercept)/(with categories intercept)/categories/[[...categories]]/page-content'

// states:
import {
    useInterceptRouter,
}                           from '@/navigations/interceptRouter'



// react components:
export default function DefaultLostDropdownIntercept(): JSX.Element|null {
    /*
        This page will be shown if one/more active_parallel_slots lost its active state.
        Example:
        First, when accessed `/categories/***` via interceptor, the route `(commons)/(with categories intercept)/@category_dropdown/(...)categories` activates the `category_dropdown` slot.
        Then,  when accessed `/categories/***` OUTSIDE `(commons)/(with categories intercept)/***`, the route `(commons)/(with categories intercept)/@category_dropdown/(...)categories` is no longer active (lost).
        Thus the `DefaultLostDropdownIntercept` will automatically be called by next-js.
    */
    
    
    
    // states:
    const {
        nonInterceptedPathname,
    } = useInterceptRouter();
    
    
    
    // jsx:
    if ((/^\/categories($|\/)/i).test(nonInterceptedPathname)) {
        let tailPathname = nonInterceptedPathname.slice('/categories'.length);
        if (tailPathname[0] === '/') tailPathname = tailPathname.slice(1);
        const categories = !tailPathname ? undefined : tailPathname.split('/');
        
        return (
            <CategoryPageContent
                // params:
                categories={categories}
            />
        );
    } // if
    
    return null;
}
