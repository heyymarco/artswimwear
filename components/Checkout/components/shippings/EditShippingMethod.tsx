'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    calculateShippingCost,
}                           from '@/libs/shippings'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditShippingMethod = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // cart data:
        totalProductWeight,
        
        
        
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
                // variants:
                theme='primary'
                
                
                
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
                                
                                {!!shippingEntry.estimate && <p className='estimate'>
                                    Estimate: {shippingEntry.estimate}
                                </p>}
                                
                                <p className='cost'>
                                    {formatCurrency(totalShippingCost)}
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
