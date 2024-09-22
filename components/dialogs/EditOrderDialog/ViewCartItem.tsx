'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // layout-components:
    ListItemProps,
    ListItem,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'
import {
    VariantIndicator,
}                           from '@/components/VariantIndicator'
import {
    ProductImage,
}                           from '@/components/views/ProductImage'

// models:
import {
    // types:
    type ProductPreview,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetProductPreview,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    useEditOrderDialogStyleSheet,
}                           from './styles/loader'



// defaults:
const imageSize = 64;  // 64px



// react components:
export interface ViewCartItemProps
    extends
        // bases:
        Omit<ListItemProps,
            // values:
            |'onChange' // already taken over
        >
{
    // data:
    currency      : string
    currencyRate ?: number
    
    unitPrice     : number
    quantity      : number
    
    
    
    // relation data:
    productId     : string|null
    variantIds    : string[]
}
const ViewCartItem = (props: ViewCartItemProps): JSX.Element|null => {
    // props:
    const {
        // relation data:
        productId,
        
        
        
        // other props:
        ...restViewCartItemProps
    } = props;
    
    
    
    // jsx:
    if (productId === null /* deleted product */) return (
        <ViewCartItemInternal {...restViewCartItemProps} product={null /* null: deleted product */ } />
    );
    return (
        <ViewCartItemWithProduct {...restViewCartItemProps} productId={productId} />
    );
};
const ViewCartItemWithProduct = (props: ViewCartItemProps & { productId: string }): JSX.Element|null => {
    // props:
    const {
        // relation data:
        productId,
        
        
        
        // other props:
        ...restViewCartItemProps
    } = props;
    
    
    
    // apis:
    const { data: product, isSuccess } = useGetProductPreview(productId);
    
    
    
    // jsx:
    return (
        <ViewCartItemInternal
            // other props:
            {...restViewCartItemProps}
            
            
            
            // data:
            product={
                isSuccess
                ? (
                    product
                    ??
                    null    // null      : has productId but no product => it's a deleted product
                )
                : undefined // undefined : unknown product (either still loading or was error)
            }
        />
    );
};
const ViewCartItemInternal = (props: Omit<ViewCartItemProps, 'productId'> & { product: ProductPreview|null|undefined }): JSX.Element|null => {
    // props:
    const {
        // data:
        currency,
        currencyRate,
        
        unitPrice,
        quantity,
        
        
        
        // relation data:
        product,
        variantIds,
        
        
        
        // other props:
        ...restListItemProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useEditOrderDialogStyleSheet();
    
    
    
    // fn props:
    const variants          = product?.variantGroups.flat();
    const isProductDeleted  = (product === null); // the relation data is available but there is no specified product => it's a deleted product
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // variants:
            theme = {isProductDeleted ? 'danger' : undefined}
            mild  = {isProductDeleted ? false    : undefined}
            
            
            
            // classes:
            className={styleSheet.viewCartItem}
            
            
            
            // accessibilities:
            enabled={!isProductDeleted}
        >
            <h3
                // classes:
                className='title h6'
            >
                {
                    !isProductDeleted
                    ? (product?.name ?? <em>Unknown Product</em>)
                    : <em>Deleted Product</em>
                }
            </h3>
            
            <p className='variants'>
                {
                    variantIds
                    .map((variantId) =>
                        variants?.find(({id}) => (id === variantId))
                    )
                    // .filter((variant): variant is Exclude<typeof variant, undefined> => !!variant)
                    .map((variant, variantIndex) =>
                        <VariantIndicator key={variantIndex} model={variant} />
                    )
                }
            </p>
            
            <ProductImage
                // data:
                productId={product?.id ?? null}
                
                
                
                // appearances:
                sizes={`${imageSize}px`}
                
                
                
                // behaviors:
                priority={false}
                
                
                
                // classes:
                className='prodImg'
            />
            
            <p className='unitPrice'>
                    <span className='label txt-sec'>
                        @
                    </span>
                    <span className='value txt-sec'>
                        <CurrencyDisplay currency={currency} currencyRate={1 /* do not convert foreign currency to cartCurrency, just display as is */} amount={unitPrice} />
                    </span>
            </p>
            
            <p className='quantity'>
                <span className='label txt-sec'>
                    Qty
                </span>
                <span className='value number'>
                    x{quantity}
                </span>
            </p>
            
            <p className='subPrice currencyBlock'>
                <span className='currency'>
                    <CurrencyDisplay currency={currency} currencyRate={1 /* do not convert foreign currency to cartCurrency, just display as is */} amount={unitPrice} multiply={quantity} />
                </span>
            </p>
        </ListItem>
    );
};
export {
    ViewCartItem,
    ViewCartItem as default,
};
