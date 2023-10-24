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
    
    
    
    // menu-components:
    Collapse,
    
    
    
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
import {
    EditPaymentMethod,
}                           from '../payments/EditPaymentMethod'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditPaymentAndBillingAddress = (): JSX.Element|null => {
    // styles:
    const styles = useCheckoutStyleSheet();
    
    
    
    // states:
    const {
        // states:
        isBusy,
        
        
        
        // billing data:
        billingValidation,
        
        billingAsShipping,
        setBillingAsShipping,
        
        
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
        
        
        
        // payment data:
        paymentMethod,
        
        
        
        // relation data:
        countryList,
        
        
        
        // sections:
        billingAddressSectionRef,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleBillingAddressExpandedChange = useEvent<EventHandler<ExclusiveExpandedChangeEvent>>(({expanded, listIndex}) => {
        // conditions:
        if (!expanded) return;
        
        
        
        // actions:
        setBillingAsShipping(listIndex === 0);
    });
    
    
    
    // jsx:
    return (
        <>
            <Section
                // classes:
                className={styles.paymentMethod}
                
                
                
                // accessibilities:
                title='Payment Method'
            >
                <EditPaymentMethod />
            </Section>
            
            <Collapse
                // classes:
                className='collapse'
                
                
                
                // behaviors:
                lazy={true}
                
                
                
                // states:
                expanded={paymentMethod !== 'paypal'} // the billingAddress is required for 'card' and 'manual'
            >
                <Section
                    // refs:
                    elmRef={billingAddressSectionRef}
                    
                    
                    
                    // accessibilities:
                    title='Billing Address'
                >
                    <p>
                        Select the address that matches your card or payment method.
                    </p>
                    
                    <ExclusiveAccordion
                        // variants:
                        theme='primary'
                        listStyle='content'
                        
                        
                        
                        // accessibilities:
                        enabled={!isBusy}
                        
                        
                        
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
                                    className={styles.optionEntryHeader}
                                />
                            }
                            bodyComponent={
                                <Section
                                    // classes:
                                    className={styles.billingEntry}
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
                                    className={styles.optionEntryHeader}
                                />
                            }
                            bodyComponent={
                                <Section
                                    // classes:
                                    className={`${styles.billingEntry} ${styles.address}`}
                                />
                            }
                        >
                            <ValidationProvider
                                // validations:
                                enableValidation={!billingAsShipping && billingValidation}
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
                        </AccordionItem>
                    </ExclusiveAccordion>
                </Section>
            </Collapse>
        </>
    );
};
export {
    EditPaymentAndBillingAddress,
    EditPaymentAndBillingAddress as default,
};
