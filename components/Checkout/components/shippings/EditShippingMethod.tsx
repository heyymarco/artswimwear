'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    List,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    RadioDecorator,
}                           from '@heymarco/radio-decorator'

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'

// contexts:
import {
    useCartState,
}                           from '@/components/Cart'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'

// utilities:
import {
    calculateShippingCost,
}                           from '@/libs/shippings/shippings'



// react components:
const EditShippingMethod = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // contexts:
    const {
        // cart data:
        totalProductWeight,
    } = useCartState();
    
    const {
        // shipping data:
        shippingProvider,
        setShippingProvider,
        
        
        
        // relation data:
        shippingList,
        
        
        
        // sections:
        shippingMethodOptionRef,
    } = useCheckoutState();
    const filteredShippingList = !shippingList ? undefined : Object.values(shippingList.entities).filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry);
    
    
    
    // jsx:
    return (
        <>
            {!!filteredShippingList && <List
                // classes:
                className={styleSheet.selectShipping}
                
                
                
                // behaviors:
                actionCtrl={true}
            >
                {
                    filteredShippingList
                    .map((shippingEntry) => ({
                        ...shippingEntry,
                        previewShippingCost : calculateShippingCost(shippingEntry, totalProductWeight) ?? -1, // -1 means: no need to ship (digital products)
                    }))
                    .sort(({previewShippingCost: a}, {previewShippingCost: b}) => (a - b))
                    .map(({previewShippingCost, ...shippingEntry}) => {
                        const isActive = `${shippingEntry.id}` === shippingProvider;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={`${shippingEntry.id}`}
                                
                                
                                
                                // refs:
                                elmRef={isActive ? shippingMethodOptionRef : undefined}
                                
                                
                                
                                // states:
                                active={isActive}
                                
                                
                                
                                // handlers:
                                onClick={() => setShippingProvider(`${shippingEntry.id}`)}
                            >
                                <RadioDecorator />
                                
                                <span className='label'>
                                    {shippingEntry.name}
                                </span>
                                
                                {!!shippingEntry.eta && <span className='eta txt-sec'>
                                    (estimate: {shippingEntry.eta.min}{(shippingEntry.eta.max > shippingEntry.eta.min) ? <>-{shippingEntry.eta.max}</> : null} day{(shippingEntry.eta.min > 1) ? 's' : ''})
                                </span>}
                                
                                <span className='cost'>
                                    <CurrencyDisplay amount={previewShippingCost} />
                                </span>
                            </ListItem>
                        );
                    })
                }
            </List>}
        </>
    );
};
export {
    EditShippingMethod,
    EditShippingMethod as default,
};
