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

// heymarco components:
import {
    AddressFields,
}                           from '@heymarco/address-fields'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditShippingAddress = (): JSX.Element|null => {
    // states:
    const {
        // shipping data:
        isShippingAddressRequired,
        shippingValidation,
        
        
        shippingCountry,
        shippingCountryHandlers,
        
        shippingState,
        shippingStateHandlers,
        
        shippingCity,
        shippingCityHandlers,
        
        shippingZip,
        shippingZipHandlers,
        
        shippingAddress,
        shippingAddressHandlers,
        
        shippingFirstName,
        shippingFirstNameHandlers,
        
        shippingLastName,
        shippingLastNameHandlers,
        
        shippingPhone,
        shippingPhoneHandlers,
        
        
        
        // relation data:
        countryList,
        
        
        
        // fields:
        shippingAddressInputRef,
    } = useCheckoutState();
    
    
    
    // jsx:
    if (!isShippingAddressRequired) return null;
    return (
        <ValidationProvider
            // validations:
            enableValidation={shippingValidation}
        >
            <AddressFields
                // refs:
                addressRef        = {shippingAddressInputRef}
                
                
                
                // types:
                addressType       = 'shipping'
                
                
                
                // values:
                countryList       = {countryList}
                country           = {shippingCountry}
                zone              = {shippingState}
                city              = {shippingCity}
                zip               = {shippingZip}
                address           = {shippingAddress}
                
                firstName         = {shippingFirstName}
                lastName          = {shippingLastName}
                phone             = {shippingPhone}
                
                
                
                // handlers:
                onCountryChange   = {shippingCountryHandlers.onChange  }
                onZoneChange      = {shippingStateHandlers.onChange    }
                onCityChange      = {shippingCityHandlers.onChange     }
                onZipChange       = {shippingZipHandlers.onChange      }
                onAddressChange   = {shippingAddressHandlers.onChange  }
                
                onFirstNameChange = {shippingFirstNameHandlers.onChange}
                onLastNameChange  = {shippingLastNameHandlers.onChange }
                onPhoneChange     = {shippingPhoneHandlers.onChange    }
            />
        </ValidationProvider>
    );
};;
export {
    EditShippingAddress,
    EditShippingAddress as default,
};
