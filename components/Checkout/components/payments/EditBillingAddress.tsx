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

// internal components:
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'
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
                // variants:
                listStyle='content'
                
                
                
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
                            Same as shipping address
                        </>
                    }
                    
                    
                    
                    // behaviors:
                    lazy={true}
                    
                    
                    
                    // components:
                    listItemComponent={
                        <ListItem
                            // classes:
                            className={styleSheet.optionEntryHeader}
                        />
                    }
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
                        Use a different billing address
                    </>}
                    
                    
                    
                    // behaviors:
                    lazy={true}
                    
                    
                    
                    // components:
                    listItemComponent={
                        <ListItem
                            // classes:
                            className={styleSheet.optionEntryHeader}
                        />
                    }
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
        
        
        billingFirstName,
        billingFirstNameHandlers,
        
        billingLastName,
        billingLastNameHandlers,
        
        
        billingPhone,
        billingPhoneHandlers,
        
        
        billingAddress,
        billingAddressHandlers,
        
        billingCity,
        billingCityHandlers,
        
        billingZone,
        billingZoneHandlers,
        
        billingZip,
        billingZipHandlers,
        
        billingCountry,
        billingCountryHandlers,
        
        
        
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
                firstName         = {billingFirstName}
                lastName          = {billingLastName}
                
                phone             = {billingPhone}
                
                address           = {billingAddress}
                city              = {billingCity}
                zone              = {billingZone}
                zip               = {billingZip}
                country           = {billingCountry}
                countryList       = {countryList}
                
                
                
                // handlers:
                onFirstNameChange = {billingFirstNameHandlers.onChange}
                onLastNameChange  = {billingLastNameHandlers.onChange }
                
                onPhoneChange     = {billingPhoneHandlers.onChange    }
                
                onAddressChange   = {billingAddressHandlers.onChange  }
                onCityChange      = {billingCityHandlers.onChange     }
                onZoneChange      = {billingZoneHandlers.onChange     }
                onZipChange       = {billingZipHandlers.onChange      }
                onCountryChange   = {billingCountryHandlers.onChange  }
            />
        </ValidationProvider>
    );
};
