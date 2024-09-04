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
    EventHandler,
    
    
    
    // a capability of UI to be highlighted/selected/activated:
    ActiveChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Check,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditSubscribeInfo = (): JSX.Element|null => {
    // states:
    const {
        // extra data:
        marketingOpt,
        setMarketingOpt,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleMarketingOptChange = useEvent<EventHandler<ActiveChangeEvent>>(({active}) => {
        setMarketingOpt(active);
    });
    
    
    
    // jsx:
    return (
        <>
            <Check
                // variants:
                checkStyle='switch'
                
                
                
                // classes:
                className='marketingOpt'
                
                
                
                // values:
                active={marketingOpt ?? true}
                onActiveChange={handleMarketingOptChange}
                
                
                
                // validations:
                required={false}
                enableValidation={false}
            >
                Email me with offers and news.
            </Check>
        </>
    );
};
export {
    EditSubscribeInfo,
    EditSubscribeInfo as default,
};
