'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// next-js:
import {
    usePathname,
}                           from 'next/navigation'

// pages:
import {
    CategoryPageContent,
}                           from '@/app/(commons)/(with categories intercept)/(with signin intercept)/categories/[[...categories]]/page-content'



// react components:
export default function LostParallelSlot(): JSX.Element|null {
    /*
        This page will be shown if one/more active_parallel_slots lost its active state.
        Example:
        First, when accessed `/categories/***` via interceptor, the route `(commons)/@category_menu/(...)categories` activates the `category_menu` slot.
        Then,  when accessed `/categories/***` OUTSIDE `(commons)/***`, the route `(commons)/@category_menu/(...)categories` is no longer active (lost).
        Thus the `LostParallelSlot` will automatically be called by next-js.
    */
    
    
    
    // states:
    const pathname = usePathname();
    
    
    
    // jsx:
    if ((/^\/categories($|\/)/i).test(pathname)) {
        let tailPathname = pathname.slice('/categories'.length);
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
