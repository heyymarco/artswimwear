'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    TextInput,
    EmailInput,
    Check,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditCustomerAccount = (): JSX.Element|null => {
    // states:
    const {
        // extra data:
        marketingOpt,
        marketingOptHandlers,
        
        
        
        // customer data:
        customerValidation,
        
        customerName,
        customerNameHandlers,
        
        customerEmail,
        customerEmailHandlers,
        
        
        
        // fields:
        contactEmailInputRef,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={customerValidation}
        >
            <InputWithLabel
                // appearances:
                icon='chat'
                
                
                
                // classes:
                className='name'
                
                
                
                // components:
                inputComponent={
                    <TextInput
                        // accessibilities:
                        placeholder='Your Nick Name'
                        
                        
                        
                        // values:
                        value={customerName}
                        
                        
                        
                        // validations:
                        required={true}
                        minLength={2}
                        maxLength={30}
                        
                        
                        
                        // formats:
                        autoComplete='nickname'
                        autoCapitalize='words'
                        
                        
                        
                        // handlers:
                        {...customerNameHandlers}
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
                    <EmailInput
                        // refs:
                        elmRef={contactEmailInputRef}
                        
                        
                        
                        // accessibilities:
                        placeholder='Your Email'
                        
                        
                        
                        // values:
                        value={customerEmail}
                        
                        
                        
                        // validations:
                        required={true}
                        minLength={5}
                        maxLength={50}
                        
                        
                        
                        // formats:
                        autoComplete='email'
                        
                        
                        
                        // handlers:
                        {...customerEmailHandlers}
                    />
                }
            />
            <Check
                // classes:
                className='marketingOpt'
                
                
                
                // values:
                active={marketingOpt}
                
                
                
                // validations:
                required={false}
                enableValidation={false}
                
                
                
                // handlers:
                {...marketingOptHandlers}
            >
                Email me with news and offers
            </Check>
        </ValidationProvider>
    );
};;
export {
    EditCustomerAccount,
    EditCustomerAccount as default,
};
