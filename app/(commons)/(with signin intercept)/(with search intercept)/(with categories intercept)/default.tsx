'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// next-js:
import {
    usePathname,
}                           from 'next/navigation'

// pages:
import {
    CategoryPageContent,
}                           from '@/app/(commons)/(with signin intercept)/(with search intercept)/(with categories intercept)/categories/[[...categories]]/page-content'



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
    const newPathname = usePathname();
    const oldPathname = location.pathname;
    
    
    
    // jsx:
    const categoriesRegex = /^\/categories($|\/)/i;
    const isNewPathnameMatch = categoriesRegex.test(newPathname);
    if (isNewPathnameMatch || categoriesRegex.test(oldPathname)) {
        let tailPathname = (isNewPathnameMatch ? newPathname : oldPathname).slice('/categories'.length);
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
