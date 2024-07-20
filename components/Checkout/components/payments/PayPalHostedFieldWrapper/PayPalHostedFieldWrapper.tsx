'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useMemo,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // a color management system:
    colorValues,
    
    
    
    // a typography management system:
    typoValues,
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    EditableTextControlProps,
    EditableTextControl,
    
    
    
    // simple-components:
    inputValues,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// // styles:
// import {
//     usePayPalHostedFieldStyleSheet,
// }                           from './styles/loader'

// paypal:
import type {
    HostedFieldsEvent,
    HostedFieldsHostedFieldsFieldName,
}                           from '@paypal/paypal-js'
import {
    PayPalHostedFieldProps,
    PayPalHostedField,
    usePayPalHostedFields,
}                           from '@paypal/react-paypal-js'



// styles:
export const hostedFieldsStyle = {
    // style input element:
    input: {
        'font-size'        : typoValues.fontSizeMd,
        'font-family'      : typoValues.fontFamilySansSerief,
        'font-weight'      : typoValues.fontWeightNormal,
        'font-style'       : typoValues.fontStyle,
        'text-decoration'  : typoValues.textDecoration,
        'line-height'      : typoValues.lineHeightMd,
        
        'color'            : colorValues.primaryBold.toString(),
    },
    '::placeholder': {
        'color'            : 'currentColor',
        'opacity'          : inputValues.placeholderOpacity,
    },
    // '::selection': {
    //     background         : colorValues.primary.toString(),     // doesn't work
    //     color              : colorValues.primaryText.toString(), // works
    // },
    
    
    // styling element states:
    // ':focus': {
    // },
    '.valid': {
        'color'            : colorValues.successBold.toString(),
    },
    // '.valid::selection': {
    //     'background-color' : colorValues.success.toString(),     // doesn't work
    //     'color'            : colorValues.successText.toString(), // works
    // },
    '.invalid': {
        'color'            : colorValues.dangerBold.toString(),
    },
    // '.invalid::selection': {
    //     'background-color' : colorValues.danger.toString(),     // doesn't work
    //     'color'            : colorValues.dangerText.toString(), // works
    // },
};



// react components:
export interface PayPalHostedFieldWrapperProps
    extends
        EditableTextControlProps,
        Pick<PayPalHostedFieldProps,
            // identifiers:
            |'id'              // required for stable hostedField id
            
            // formats:
            |'hostedFieldType' // required for determining field type
            
            |'options'         // required for field options
            // |'className'
            // |'lang'
            // |'title'
            // |'style'
        >
{
    // formats:
    hostedFieldType : HostedFieldsHostedFieldsFieldName
}
const PayPalHostedFieldWrapper = (props: PayPalHostedFieldWrapperProps) => {
    // rest props:
    const {
        // identifiers:
        id,
        
        
        
        // formats:
        hostedFieldType,
        options,
    ...restEditableTextControlProps} = props;
    
    
    
    // // styles:
    // const styleSheet = usePayPalHostedFieldStyleSheet();
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean|undefined>(false);
    const [isValid  , setIsValid  ] = useState<boolean|undefined>(true);
    
    
    
    // handlers:
    const handleFocusBlur    = useEvent((event: HostedFieldsEvent) => {
        // conditions:
        const field = event.fields?.[hostedFieldType]; // find the field in hostedForm
        if (!field)                        return;     // not found in hostedForm => ignore
        if (field.isFocused === isFocused) return;     // already focused/blurred => nothing to change
        
        
        
        // actions:
        setIsFocused(field.isFocused);
    });
    const handleValidInvalid = useEvent((event: HostedFieldsEvent) => {
        // conditions:
        const field = event.fields?.[hostedFieldType]; // find the field in hostedForm
        if (!field)                    return;         // not found in hostedForm => ignore
        if (field.isValid === isValid) return;         // already validated/invalidated => nothing to change
        
        
        
        // actions:
        setIsValid(field.isValid);
    });
    
    
    
    // dom effects:
    const {cardFields} = usePayPalHostedFields();
    
    // setup the initial state of `isFocused` & `isValid`:
    useEffect(() => {
        // conditions:
        if (!cardFields) return; // hostedForm not found => ignore
        const field = cardFields.getState()?.fields?.[hostedFieldType]; // find the field in hostedForm
        if (!field)      return; // not found in hostedForm => ignore
        
        
        
        // setups:
        setIsValid(field.isValid);
        setIsFocused(field.isFocused);
    }, [cardFields, hostedFieldType]);
    
    // setup the event handlers:
    useEffect(() => {
        // conditions:
        if (!cardFields) return;
        
        
        
        // setups:
        cardFields.on('focus'          , handleFocusBlur);
        cardFields.on('blur'           , handleFocusBlur);
        cardFields.on('validityChange' , handleValidInvalid);
        
        
        
        // cleanups:
        return () => {
            /*
                off?.() : workaround for 'TypeError: cardFields.off is not a function'
            */
            cardFields.off?.('focus'          , handleFocusBlur);
            cardFields.off?.('blur'           , handleFocusBlur);
            cardFields.off?.('validityChange' , handleValidInvalid);
        };
    }, [cardFields]);
    
    
    
    // caches:
    const {
        selector,
        placeholder,
        type,
        formatInput,
        maskInput,
        select,
        maxlength,
        minlength,
        prefill,
        rejectUnsupportedCards,
    } = options;
    const cachedHostedField = useMemo(() => {
        const options = {
            selector,
            placeholder,
            type,
            formatInput,
            maskInput,
            select,
            maxlength,
            minlength,
            prefill,
            rejectUnsupportedCards,
        };
        
        
        
        // jsx:
        return (
            <PayPalHostedField
                // identifiers:
                id={id}
                
                
                
                // classes:
                // className={styleSheet.main} // doesn't work for focusing/blurring
                
                
                
                // formats:
                hostedFieldType={hostedFieldType}
                
                
                
                // options:
                options={options}
            />
        );
    }, [
        // identifiers:
        id,
        
        
        
        // formats:
        hostedFieldType,
        
        
        
        // options:
        selector,
        placeholder,
        type,
        formatInput,
        maskInput,
        select,
        maxlength,
        minlength,
        prefill,
        rejectUnsupportedCards,
    ]);
    
    
    
    // jsx:
    return (
        <EditableTextControl
            // other props:
            {...restEditableTextControlProps}
            
            
            
            // accessibilities:
            tabIndex   = {-1}
            aria-label = {placeholder}
            
            
            
            // states:
            focused    = {isFocused ?? false}
            isValid    = {isValid   ?? null }
        >
            {cachedHostedField}
        </EditableTextControl>
    );
};
export {
    PayPalHostedFieldWrapper,
    PayPalHostedFieldWrapper as default,
};
