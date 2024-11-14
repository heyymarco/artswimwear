'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
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
    useIsomorphicLayoutEffect,
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

// paypal:
import type {
    PayPalCardFieldsStyleOptions,
    PayPalCardFieldsStateObject,
}                           from '@paypal/paypal-js'
import {
    PayPalCardFieldsIndividualFieldOptions,
    usePayPalCardFields,
}                           from '@paypal/react-paypal-js'



// styles:
const cardFieldResetStyle    : PayPalCardFieldsStyleOptions = {
    // layouts:
    'appearance'           : 'none !important',
    
    
    
    // sizes:
    // @ts-ignore
    'height'               : '1lh !important',
    
    
    
    // backgrounds:
    // @ts-ignore
    'background'           : 'none !important',
    
    
    
    // borders:
    // @ts-ignore
    'border'               : 'none !important',
    'borderRadius'         : '0 !important',
    'outline'              : 'none !important',
    'box-shadow'           : 'none !important',
    
    
    
    // spacings:
    'padding'              : '0 !important',
};
export const cardFieldsStyle : Record<string, PayPalCardFieldsStyleOptions> = {
    // bases:
    body: {
        // spacings:
        'padding'          : '0',
        
        
        
        // typos:
        'font-size'        : `${typoValues.fontSizeMd}` || undefined,
    },
    
    
    
    // icons:
    '.card-icon': {
        // @ts-ignore
        // 'left'             : '0', doesn't work
        'width'            : '40px',
        'height'           : '1lh',
    },
    'input.card-field-number.display-icon': {
        'padding-left'     : 'calc(40px + 1.2rem + 1em) !important',
    },
    
    
    
    // inputs:
    input: {
        // resets:
        ...cardFieldResetStyle,
        
        
        
        // foregrounds:
        'color'            : colorValues.primaryBold.toString(),
        
        
        
        // typos:
        'font-size'        : `${typoValues.fontSizeMd}` || undefined,
        'font-family'      : `${typoValues.fontFamilySansSerief}` || undefined,
        'font-weight'      : `${typoValues.fontWeightNormal}` || undefined,
        'font-style'       : `${typoValues.fontStyle}` || undefined,
        // @ts-ignore
        'text-decoration'  : `${typoValues.textDecoration}` || undefined,
        'line-height'      : `${typoValues.lineHeightMd}` || undefined,
    },
    '::placeholder': {
        // appearances:
        'opacity'          : `${inputValues.placeholderOpacity}` || undefined,
        
        
        
        // foregrounds:
        'color'            : 'currentColor',
    },
    '::selection': {
        // @ts-ignore
        background         : colorValues.primary.toString(),
        color              : colorValues.primaryText.toString(),
    },
    
    
    // states:
    ':focus': cardFieldResetStyle,
    '.valid': {
        // resets:
        ...cardFieldResetStyle,
        
        
        
        // foregrounds:
        'color'            : colorValues.successBold.toString(),
    },
    '.valid::selection': {
        // @ts-ignore
        'background'       : colorValues.success.toString(),
        'color'            : colorValues.successText.toString(),
    },
    '.invalid': {
        // resets:
        ...cardFieldResetStyle,
        
        
        
        // foregrounds:
        'color'            : colorValues.dangerBold.toString(),
    },
    '.invalid::selection': {
        // @ts-ignore
        'background'       : colorValues.danger.toString(),
        'color'            : colorValues.dangerText.toString(),
    },
};



// react components:
export interface PayPalCardFieldWrapperProps
    extends
        Omit<EditableTextControlProps,
            // styles:
            |'style'
        >,
        Pick<PayPalCardFieldsIndividualFieldOptions,
            // styles:
            |'style'
            
            // accessibilities:
            |'placeholder'
        >
{
    // formats:
    type                     : keyof Awaited<PayPalCardFieldsStateObject>['fields']
    
    
    
    // components:
    payPalCardFieldComponent : React.ReactElement<PayPalCardFieldsIndividualFieldOptions>
}
const PayPalCardFieldWrapper = (props: PayPalCardFieldWrapperProps) => {
    // props:
    const {
        // styles:
        style,
        
        
        
        // accessibilities:
        placeholder,
        
        
        
        // formats:
        type,
        
        
        
        // components:
        payPalCardFieldComponent,
        
        
        
        // other props:
        ...restPayPalCardFieldWrapperProps
    } = props;
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isValid  , setIsValid  ] = useState<boolean>(true);
    
    
    
    // handlers:
    const handleFocus    = useEvent((data: PayPalCardFieldsStateObject): void => {
        // actions:
        setIsFocused(true);
    });
    const handleBlur    = useEvent((data: PayPalCardFieldsStateObject): void => {
        // actions:
        setIsFocused(false);
    });
    const handleValidInvalid = useEvent((data: PayPalCardFieldsStateObject): void => {
        // actions:
        setIsValid(data.fields[type].isValid && !data.fields[type].isEmpty);
    });
    
    
    
    // effects:
    const {
        cardFieldsForm,
    } = usePayPalCardFields();
    useIsomorphicLayoutEffect(() => {
        // conditions:
        console.log({cardFieldsForm});
        if (!cardFieldsForm) return;
        
        
        
        // setups:
        let isMounted = true;
        cardFieldsForm.getState().then((data) => {
            console.log('initial state: ', {
                isMounted,
                isFocused: data.fields[type].isFocused,
                isValid: data.fields[type].isValid,
                isEmpty: data.fields[type].isEmpty,
                isValidCombi: data.fields[type].isValid && !data.fields[type].isEmpty,
            })
            if (!isMounted) return;
            setIsFocused(data.fields[type].isFocused);
            setIsValid(data.fields[type].isValid && !data.fields[type].isEmpty);
        });
        
        
        
        // cleanups:
        return () => {
            isMounted = false;
        };
    }, [cardFieldsForm]);
    
    
    
    // caches:
    const cachedCardField = useMemo(() => {
        // jsx:
        return React.cloneElement<PayPalCardFieldsIndividualFieldOptions>(payPalCardFieldComponent,
            // props:
            {
                // styles:
                style,
                
                
                
                // accessibilities:
                placeholder,
                
                
                
                // handlers:
                inputEvents : {
                    onFocus              : handleFocus,
                    onBlur               : handleBlur,
                    onChange             : handleValidInvalid,
                    onInputSubmitRequest : handleValidInvalid,
                },
            },
        );
    }, [
        // styles:
        style,
        
        
        
        // accessibilities:
        placeholder,
        
        
        
        // handlers:
        // handleFocus,        // stable ref
        // handleBlur,         // stable ref
        // handleValidInvalid, // stable ref
    ]);
    
    
    
    // default props:
    const {
        // accessibilities:
        tabIndex     : editableTabIndex  = -1,
        'aria-label' : editableAriaLabel = placeholder,
        
        
        
        // states:
        focused      : editableFocused   = isFocused,
        isValid      : editableIsValid   = isValid,
        
        
        // other props:
        ...restEditableTextControlProps
    } = restPayPalCardFieldWrapperProps;
    
    
    
    // jsx:
    return (
        <EditableTextControl
            // other props:
            {...restEditableTextControlProps}
            
            
            
            // accessibilities:
            tabIndex   = {editableTabIndex}
            aria-label = {editableAriaLabel}
            
            
            
            // states:
            focused    = {editableFocused}
            isValid    = {editableIsValid}
        >
            {cachedCardField}
        </EditableTextControl>
    );
};
export {
    PayPalCardFieldWrapper,
    PayPalCardFieldWrapper as default,
};
