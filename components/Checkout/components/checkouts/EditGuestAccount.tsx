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
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

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
        // customer data:
        customerValidation,
        
        customer,
        setCustomerName,
        setCustomerEmail,
        
        
        
        // fields:
        contactEmailInputRef,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={customerValidation}
        >
            <div
                // classes:
                className={styleSheet.editGuestSection}
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
            </div>
        </ValidationProvider>
    );
};
export {
    EditGuestAccount,
    EditGuestAccount as default,
};
