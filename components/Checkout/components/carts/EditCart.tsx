'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    EditCartProps,
    EditCart as BaseEditCart,
}                           from '@/components/Cart/components/carts/EditCart'
import {
    ResponsiveDetails,
}                           from '../ResponsiveDetails'



// react components:
export type {
    EditCartProps,
}
const EditCart = (props: EditCartProps): JSX.Element|null => {
    // jsx:
    return (
        <ResponsiveDetails
            // variants:
            detailsStyle='content'
            
            
            
            // classes:
            className='orderCollapse'
            
            
            
            // accessibilities:
            title='Order List'
            
            enabled={true}         // always enabled
            inheritEnabled={false} // always enabled
        >
            <BaseEditCart
                // other props:
                {...props}
            />
        </ResponsiveDetails>
    );
};
export {
    EditCart,
    EditCart as default,
};
