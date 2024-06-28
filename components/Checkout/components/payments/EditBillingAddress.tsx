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
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    
    
    // composite-components:
    AccordionItem,
    ExclusiveExpandedChangeEvent,
    ExclusiveAccordion,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'
import {
    AddressFields,
}                           from '@heymarco/address-fields'
import {
    RadioDecorator,
}                           from '@heymarco/radio-decorator'

// internal components:
import {
    ViewShippingAddress,
}                           from '../informations/ViewShippingAddress'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditBillingAddress = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // shipping data:
        isShippingAddressRequired,
        
        
        
        // billing data:
        isBillingAddressRequired,
        
        billingAsShipping,
        setBillingAsShipping,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleBillingAddressExpandedChange = useEvent<EventHandler<ExclusiveExpandedChangeEvent>>(({expanded, listIndex}) => {
        // conditions:
        if (!expanded) return;
        
        
        
        // actions:
        setBillingAsShipping(listIndex === 0);
    });
    
    
    
    // jsx:
    if (!isBillingAddressRequired) return null;
    if (!isShippingAddressRequired) return (
        <Section
            // classes:
            className={`${styleSheet.billingEntry} ${styleSheet.address}`}
        >
            <EditBillingAddressImpl />
        </Section>
    );
    return (
        <>
            <ExclusiveAccordion
                // classes:
                className={styleSheet.selectBilling}
                
                
                
                // states:
                expandedListIndex={billingAsShipping ? 0 : 1}
                
                
                
                // handlers:
                onExpandedChange={handleBillingAddressExpandedChange}
            >
                <AccordionItem
                    // accessibilities:
                    label={
                        <>
                            <RadioDecorator />
                            <span className='label'>
                                Same as shipping address
                            </span>
                        </>
                    }
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes collapsing animation error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={styleSheet.billingEntry}
                        />
                    }
                >
                    <ViewShippingAddress />
                </AccordionItem>
                
                <AccordionItem
                    // accessibilities:
                    label={<>
                        <RadioDecorator />
                        <span className='label'>
                            Use a different billing address
                        </span>
                    </>}
                    
                    
                    
                    // behaviors:
                    // lazy={true} // causes collapsing animation error
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Section
                            // classes:
                            className={`${styleSheet.billingEntry} ${styleSheet.address}`}
                        />
                    }
                >
                    <EditBillingAddressImpl />
                </AccordionItem>
            </ExclusiveAccordion>
        </>
    );
};
export {
    EditBillingAddress,
    EditBillingAddress as default,
};



const EditBillingAddressImpl = (): JSX.Element|null => {
    // states:
    const {
        // billing data:
        billingValidation,
        
        
        billingCountry,
        billingCountryHandlers,
        
        billingState,
        billingStateHandlers,
        
        billingCity,
        billingCityHandlers,
        
        billingZip,
        billingZipHandlers,
        
        billingAddress,
        billingAddressHandlers,
        
        billingFirstName,
        billingFirstNameHandlers,
        
        billingLastName,
        billingLastNameHandlers,
        
        billingPhone,
        billingPhoneHandlers,
        
        
        
        // relation data:
        countryList,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={billingValidation}
        >
            <AddressFields
                // types:
                addressType       = 'billing'
                
                
                
                // values:
                countryList       = {countryList}
                country           = {billingCountry}
                zone              = {billingState}
                city              = {billingCity}
                zip               = {billingZip}
                address           = {billingAddress}
                
                firstName         = {billingFirstName}
                lastName          = {billingLastName}
                phone             = {billingPhone}
                
                
                
                // handlers:
                onCountryChange   = {billingCountryHandlers.onChange  }
                onZoneChange      = {billingStateHandlers.onChange    }
                onCityChange      = {billingCityHandlers.onChange     }
                onZipChange       = {billingZipHandlers.onChange      }
                onAddressChange   = {billingAddressHandlers.onChange  }
                
                onFirstNameChange = {billingFirstNameHandlers.onChange}
                onLastNameChange  = {billingLastNameHandlers.onChange }
                onPhoneChange     = {billingPhoneHandlers.onChange    }
            />
        </ValidationProvider>
    );
};
