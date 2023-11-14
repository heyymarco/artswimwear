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
        
        
        shippingFirstName,
        shippingFirstNameHandlers,
        
        shippingLastName,
        shippingLastNameHandlers,
        
        
        shippingPhone,
        shippingPhoneHandlers,
        
        
        shippingAddress,
        shippingAddressHandlers,
        
        shippingCity,
        shippingCityHandlers,
        
        shippingZone,
        shippingZoneHandlers,
        
        shippingZip,
        shippingZipHandlers,
        
        shippingCountry,
        shippingCountryHandlers,
        
        
        
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
                firstName         = {shippingFirstName}
                lastName          = {shippingLastName}
                
                phone             = {shippingPhone}
                
                address           = {shippingAddress}
                city              = {shippingCity}
                zone              = {shippingZone}
                zip               = {shippingZip}
                country           = {shippingCountry}
                countryList       = {countryList}
                
                
                
                // handlers:
                onFirstNameChange = {shippingFirstNameHandlers.onChange}
                onLastNameChange  = {shippingLastNameHandlers.onChange }
                
                onPhoneChange     = {shippingPhoneHandlers.onChange    }
                
                onAddressChange   = {shippingAddressHandlers.onChange  }
                onCityChange      = {shippingCityHandlers.onChange     }
                onZoneChange      = {shippingZoneHandlers.onChange     }
                onZipChange       = {shippingZipHandlers.onChange      }
                onCountryChange   = {shippingCountryHandlers.onChange  }
            />
        </ValidationProvider>
    );
};;
export {
    EditShippingAddress,
    EditShippingAddress as default,
};
