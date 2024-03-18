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

// internal components:
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'
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
}                           from '@/libs/shippings'



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
                // behaviors:
                actionCtrl={true}
            >
                {
                    filteredShippingList
                    .map((shippingEntry) => ({
                        totalShippingCost : calculateShippingCost(totalProductWeight, shippingEntry),
                        ...shippingEntry,
                    }))
                    .sort(({totalShippingCost: a}, {totalShippingCost: b}): number => (a ?? 0) - (b ?? 0))
                    .map(({totalShippingCost, ...shippingEntry}) => {
                        const isActive = `${shippingEntry.id}` === shippingProvider;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={`${shippingEntry.id}`}
                                
                                
                                
                                // refs:
                                elmRef={isActive ? shippingMethodOptionRef : undefined}
                                
                                
                                
                                // classes:
                                className={styleSheet.optionEntryHeader}
                                
                                
                                
                                // states:
                                active={isActive}
                                
                                
                                
                                // handlers:
                                onClick={() => setShippingProvider(`${shippingEntry.id}`)}
                            >
                                <RadioDecorator />
                                
                                <p className='name'>
                                    {shippingEntry.name}
                                </p>
                                
                                {!!shippingEntry.estimate && <p className='estimate txt-sec'>
                                    (estimate: {shippingEntry.estimate})
                                </p>}
                                
                                <p className='cost'>
                                    <CurrencyDisplay amount={totalShippingCost} />
                                </p>
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
