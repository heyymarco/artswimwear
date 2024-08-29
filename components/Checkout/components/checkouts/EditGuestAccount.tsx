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

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    
    
    
    // a validation management system:
    ValidationProvider,
    
    
    
    // a capability of UI to be highlighted/selected/activated:
    ActiveChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Check,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    EmailEditor,
}                           from '@heymarco/email-editor'
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditGuestAccount = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // extra data:
        marketingOpt,
        setMarketingOpt,
        
        
        
        // customer data:
        customerValidation,
        
        customer,
        setCustomerName,
        setCustomerEmail,
        
        
        
        // fields:
        contactEmailInputRef,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleMarketingOptChange = useEvent<EventHandler<ActiveChangeEvent>>(({active}) => {
        setMarketingOpt(active);
    });
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={customerValidation}
        >
            <div
                // classes:
                className={styleSheet.editGuestAccount}
            >
                <InputWithLabel
                    // appearances:
                    icon='chat'
                    
                    
                    
                    // classes:
                    className='name'
                    
                    
                    
                    // components:
                    inputComponent={
                        <NameEditor
                            // accessibilities:
                            aria-label='Your Nick Name'
                            placeholder='Your Nick Name'
                            
                            
                            
                            // values:
                            value={customer?.name ?? ''}
                            onChange={setCustomerName}
                            
                            
                            
                            // validations:
                            required={true}
                            minLength={2}
                            maxLength={30}
                            
                            
                            
                            // formats:
                            autoComplete='nickname'
                            autoCapitalize='words'
                        />
                    }
                />
                <InputWithLabel
                    // appearances:
                    icon='email'
                    
                    
                    
                    // classes:
                    className='email'
                    
                    
                    
                    // components:
                    inputComponent={
                        <EmailEditor
                            // refs:
                            elmRef={contactEmailInputRef}
                            
                            
                            
                            // accessibilities:
                            aria-label='Your Email'
                            placeholder='Your Email'
                            
                            
                            
                            // values:
                            value={customer?.email ?? ''}
                            onChange={setCustomerEmail}
                            
                            
                            
                            // validations:
                            required={true}
                            minLength={5}
                            maxLength={50}
                            
                            
                            
                            // formats:
                            autoComplete='email'
                        />
                    }
                />
                <Check
                    // classes:
                    className='marketingOpt'
                    
                    
                    
                    // values:
                    active={marketingOpt ?? true}
                    onActiveChange={handleMarketingOptChange}
                    
                    
                    
                    // validations:
                    required={false}
                    enableValidation={false}
                >
                    Email me with news and offers
                </Check>
            </div>
        </ValidationProvider>
    );
};;
export {
    EditGuestAccount,
    EditGuestAccount as default,
};
