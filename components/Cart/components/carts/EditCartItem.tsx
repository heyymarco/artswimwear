'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    
    
    
    // an accessibility management system:
    usePropReadOnly,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    ListItemProps,
    ListItem,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    NumberUpDownEditor,
}                           from '@heymarco/number-updown-editor'

// internal components:
import {
    VariantIndicator,
}                           from '@/components/VariantIndicator'
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'

// models:
import {
    type CartItemPreview,
}                           from '@/models'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// contexts:
import {
    // hooks:
    useCheckoutState,
}                           from '@/components/Checkout/states/checkoutState'

// internals:
import {
    useCartStyleSheet,
}                           from '../../styles/loader'
import {
    useCartState,
}                           from '../../states/cartState'



// react components:
export interface EditCartItemProps
    extends
        // bases:
        Omit<ListItemProps,
            // values:
            |'onChange' // already taken over
        >
{
    // data:
    cartItem  : CartItemPreview
    
    
    
    // handlers:
    onChange  : (productId: string, variantIds: string[], quantity: number) => void
    onDelete  : (productId: string, variantIds: string[]) => void
}
const EditCartItem = (props: EditCartItemProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCartStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        cartItem : {
            productId,
            variantIds,
            quantity,
        },
        
        
        
        // handlers:
        onChange,
        onDelete,
    ...restListItemProps} = props;
    
    
    
    // accessibilities:
    const propReadOnly = usePropReadOnly(props);
    
    
    
    // states:
    const {
        // states:
        isCartReady,
        
        
        
        // relation data:
        productPreviews,
    } = useCartState();
    
    const {
        isBusy,
    } = useCheckoutState();
    
    
    
    // fn props:
    const product               = productPreviews?.get(productId);
    const selectedVariants      = !product ? undefined : (
        product.variantGroups
        .map((variants) =>
            variants.find(({id: variantId}) =>
                variantIds.includes(variantId)
            )
        )
    );
    const productUnitPriceParts = (
        // is valid product & valid selected variants?
        (
            !product
            ||
            !selectedVariants
            ||
            (!selectedVariants.every((selectedVariant): selectedVariant is Exclude<typeof selectedVariant, undefined> => (selectedVariants !== undefined)))
        )
        // invalid product:
        ? undefined
        // valid product:
        : [
            // base price:
            product.price,
            
            // additional prices, based on selected variants:
            ...selectedVariants.map(({price}) => price),
        ]
    );
    const variants              = product?.variantGroups.flat();
    const isProductDeleted      = isCartReady && !product; // the relation data is available but there is no specified productId in productPreviews => it's a deleted product
    
    
    
    // handlers:
    const handleQuantityChange = useEvent<EditorChangeEventHandler<number, React.ChangeEvent<HTMLInputElement>>>((value): void => {
        // actions:
        if (value > 0) {
            onChange(productId, variantIds, value);
        }
        else {
            handleDelete();
        } // if
    });
    const handleDelete = useEvent((): void => {
        // actions:
        onDelete(productId, variantIds);
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // variants:
            theme={isProductDeleted ? 'danger' : undefined}
            mild={isProductDeleted ? false : undefined}
            
            
            
            // classes:
            className={styleSheet.editCartItem}
            
            
            
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
                    .filter((variant): variant is Exclude<typeof variant, undefined> => !!variant)
                    .map((variant, variantIndex) =>
                        <VariantIndicator key={variantIndex} model={variant} />
                    )
                }
            </p>
            
            <Image
                // appearances:
                alt={product?.name ?? ''}
                src={resolveMediaUrl(product?.image)}
                sizes='64px'
                
                
                
                // classes:
                className='prodImg'
            />
            
            {(productUnitPriceParts !== undefined) && <p className='unitPrice'>
                    <span className='label txt-sec'>
                        @
                    </span>
                    <span className='value txt-sec'>
                        <CurrencyDisplay amount={productUnitPriceParts} />
                    </span>
            </p>}
            
            <Generic tag={propReadOnly ? 'p' : 'div'} className='quantity'>
                <span className='label txt-sec'>
                    Qty
                </span>
                {propReadOnly && <span className='value number'>
                    x{quantity}
                </span>}
                {!propReadOnly && <Group
                    // variants:
                    size='sm'
                    
                    
                    
                    // classes:
                    className='value control'
                    
                    
                    
                    // accessibilities:
                    title='Quantity'
                    
                    
                    
                    // states:
                    enabled={!isBusy} // disabled if busy
                >
                    <ButtonIcon
                        // appearances:
                        icon='delete'
                        
                        
                        
                        // accessibilities:
                        title='remove from cart'
                        
                        
                        
                        // handlers:
                        onClick={handleDelete}
                    />
                    <NumberUpDownEditor
                        // accessibilities:
                        enabled={!isProductDeleted}
                        
                        
                        
                        // values:
                        value={quantity}
                        onChange={handleQuantityChange}
                        
                        
                        
                        // validations:
                        min={0}
                        max={99}
                    />
                </Group>}
            </Generic>
            
            <p className='subPrice currencyBlock'>
                {isProductDeleted && <>This product was deleted</>}
                
                {!isProductDeleted && <span className='currency'>
                    <CurrencyDisplay amount={productUnitPriceParts} multiply={quantity} />
                </span>}
            </p>
        </ListItem>
    );
};
export {
    EditCartItem,
    EditCartItem as default,
};
