'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'



// react components:
export default function DialogInterceptLayout({
    children,
    category_dropdown,
}: {
    children          : React.ReactNode
    category_dropdown : React.ReactNode
}): JSX.Element|null {
    /*
        TODO: fix a page intercept bug.
        When navigate Products > dropdown > Discounted > Discount 3 > Discount 3-1,
        then navigate with <nav> to Discount 3,
        then open search > close search,
        then navigate with <nav> to Discounted,
        the content of Discounted 3 page should appear,
        but the home page appears.
    */
    // jsx:
    return (
        <>
            {children}
            {category_dropdown}
        </>
    );
}
