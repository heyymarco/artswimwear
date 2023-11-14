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

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'
import {
    EditShippingAddress,
}                           from './EditShippingAddress'

// internal components:
import {
    InputWithLabel,
}                           from '@/components/InputWithLabel'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditRegularCheckout = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // extra data:
        marketingOpt,
        marketingOptHandlers,
        
        
        
        // customer data:
        customerNickName,
        customerNickNameHandlers,
        
        customerEmail,
        customerEmailHandlers,
        
        
        
        // shipping data:
        isShippingAddressRequired,
        shippingValidation,
        
        
        
        // fields:
        contactEmailInputRef,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={shippingValidation}
        >
            <Section
                // classes:
                className='contact'
                
                
                
                // accessibilities:
                title='Contact Information'
            >
                <InputWithLabel
                    // appearances:
                    icon='chat'
                    
                    
                    
                    // classes:
                    className='nick'
                    
                    
                    
                    // components:
                    inputComponent={
                        <TextInput
                            // accessibilities:
                            placeholder='Your Nick Name'
                            
                            
                            
                            // values:
                            value={customerNickName}
                            
                            
                            
                            // validations:
                            required={true}
                            minLength={2}
                            maxLength={30}
                            
                            
                            
                            // formats:
                            autoComplete='nickname'
                            autoCapitalize='words'
                            
                            
                            
                            // handlers:
                            {...customerNickNameHandlers}
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
            </Section>
            
            {isShippingAddressRequired && <Section
                // classes:
                className={styleSheet.address}
                
                
                
                // accessibilities:
                title='Shipping Address'
            >
                <EditShippingAddress />
            </Section>}
        </ValidationProvider>
    );
};;
export {
    EditRegularCheckout,
    EditRegularCheckout as default,
};
