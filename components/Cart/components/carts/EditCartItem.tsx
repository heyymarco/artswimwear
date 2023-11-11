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
    QuantityInput,
}                           from '@heymarco/quantity-input'

// stores:
import type {
    // types:
    CartEntry,
}                           from '@/store/features/cart/cartSlice'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

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
    cartEntry : CartEntry
    
    
    
    // handlers:
    onChange  : (productId: string, quantity: number) => void
    onDelete  : (productId: string) => void
}
const EditCartItem = (props: EditCartItemProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCartStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        cartEntry : {
            productId,
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
        productList,
    } = useCartState();
    
    
    
    // fn props:
    const product          = productList?.entities?.[productId];
    const productUnitPrice = product?.price;
    const isProductDeleted = isCartReady && !product; // the relation data is available but there is no specified productId in productList => it's a deleted product
    
    
    
    // handlers:
    const handleChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {valueAsNumber}}): void => {
        // actions:
        if (valueAsNumber > 0) {
            onChange(productId, valueAsNumber);
        }
        else {
            handleDelete();
        } // if
    });
    const handleDelete = useEvent((): void => {
        // actions:
        onDelete(productId);
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
                    ? product?.name
                    : 'PRODUCT DELETED'
                }
            </h3>
            
            <Image
                // appearances:
                alt={product?.name ?? ''}
                src={resolveMediaUrl(product?.image)}
                sizes='64px'
                
                
                
                // classes:
                className='prodImg'
            />
            
            {(productUnitPrice !== undefined) && <p className='unitPrice'>
                    <span className='label txt-sec'>
                        @
                    </span>
                    <span className='value txt-sec'>
                        {formatCurrency(productUnitPrice)}
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
                >
                    <ButtonIcon
                        // appearances:
                        icon='delete'
                        
                        
                        
                        // accessibilities:
                        title='remove from cart'
                        
                        
                        
                        // handlers:
                        onClick={handleDelete}
                    />
                    <QuantityInput
                        // accessibilities:
                        enabled={!isProductDeleted}
                        
                        
                        
                        // values:
                        value={quantity}
                        onChange={handleChange}
                        
                        
                        
                        // validations:
                        min={0}
                        max={99}
                    />
                </Group>}
            </Generic>
            
            <p className='subPrice currencyBlock'>
                {isProductDeleted && <>This product was deleted</>}
                
                {!isProductDeleted && <span className='currency'>
                    {formatCurrency((productUnitPrice !== undefined) ? (productUnitPrice * quantity) : undefined)}
                </span>}
            </p>
        </ListItem>
    );
};
export {
    EditCartItem,
    EditCartItem as default,
};
