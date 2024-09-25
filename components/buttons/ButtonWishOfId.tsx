'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// private components:
import {
    type ButtonWishProps,
    ButtonWish,
}                           from './ButtonWish'

// stores:
import {
    // hooks:
    useGetProductPreview,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface ButtonWishOfIdProps
    extends
        // bases:
        Omit<ButtonWishProps,
            // data:
            |'model'
        >
{
    // data:
    productId : string
}
const ButtonWishOfId = (props: ButtonWishOfIdProps) => {
    // props:
    const {
        // data:
        productId,
        
        
        
        // other props:
        ...restButtonWishProps
    } = props;
    
    
    
    // apis:
    const { data: product, isLoading: isProductLoading } = useGetProductPreview(productId);
    
    
    
    // jsx:
    return (
        <ButtonWish
            // other props:
            {...restButtonWishProps}
            
            
            
            // data:
            model={product}
            
            
            
            // appearances:
            icon={
                !!product
                ? undefined
                : (
                    isProductLoading
                    ? 'busy'
                    : undefined
                )
            }
            
            
            
            // states:
            enabled={!!product}
        />
    );
};
export {
    ButtonWishOfId,            // named export for readibility
    ButtonWishOfId as default, // default export to support React.lazy
}
