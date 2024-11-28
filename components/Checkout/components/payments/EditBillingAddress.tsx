'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
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
    RadioDecorator,
}                           from '@heymarco/radio-decorator'
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'

// internal components:
import {
    ViewShippingAddress,
}                           from '../informations/ViewShippingAddress'
import {
    type Address as EditorAddress,
    AddressEditor,
}                           from '@/components/editors/AddressEditor'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'

// states:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'
import {
    useTransactionState,
}                           from '@/components/payments/states'

// models:
import {
    // type ShippingAddressDetail as Address, // the same thing
    type BillingAddressDetail  as Address,
}                           from '@/models'



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
    if (!isBillingAddressRequired) return null; // do NOT render billingEditor if the billingAddress is NOT required
    if (!isShippingAddressRequired) return (    // the billingEditor is MANDATORY required if NO shippingAddress required (NO shippingEditor)
        <Section
            // classes:
            className={styleSheet.billingEntry}
        >
            <EditBillingAddressImpl />
        </Section>
    );
    return ( // if BOTH billingAddress AND shippingAddress REQUIRED => the user can choose billingAsShipping OR type billingAddress manually
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
                            className={styleSheet.billingEntry}
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
        billingAddress,
        setBillingAddress,
    } = useCheckoutState();
    
    const {
        // billing data:
        billingValidation,
    } = useTransactionState();
    
    const editorAddress = useMemo((): EditorAddress|null => {
        if (!billingAddress) return null;
        return {
            ...billingAddress,
            company : '',
            zip: billingAddress.zip ?? '',
        };
    }, [billingAddress]);
    
    
    
    // handlers:
    const handleChange = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, EditorAddress|null>>((newValue, event) => {
        const address : Address|null = (
            !newValue
            ? null
            : (() => {
                const {
                    company : _company,
                    ...restValue
                } = newValue;
                return {
                    ...restValue,
                    zip : newValue.zip.trim() || null,
                } satisfies Address;
            })()
        );
        setBillingAddress(address);
    });
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={billingValidation}
        >
            <AddressEditor
                // types:
                addressType       = 'billing'
                
                
                
                // values:
                value       = {editorAddress}
                onChange    = {handleChange}
                
                
                
                // components:
                companyEditorComponent={null}
            />
        </ValidationProvider>
    );
};
