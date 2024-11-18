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

// styles:
import {
    useStripeCardFieldStyleSheet,
}                           from './styles/loader'

// stripe:
import {
    type StripeCardNumberElementChangeEvent,
    type StripeCardExpiryElementChangeEvent,
    type StripeCardCvcElementChangeEvent,
    type StripeElementStyle,
}                           from '@stripe/stripe-js'
import {
    type CardNumberElementProps,
    type CardExpiryElementProps,
    type CardCvcElementProps,
}                           from '@stripe/react-stripe-js'



// styles:
const style : StripeElementStyle = {
    base : {
        fontSize            : typoValues.fontSizeMd?.toString(),
        fontFamily          : typoValues.fontFamilySansSerief?.toString(),
        fontWeight          : typoValues.fontWeightNormal?.toString(),
        fontStyle           : typoValues.fontStyle?.toString(),
        textDecoration      : typoValues.textDecoration?.toString(),
        lineHeight          : typoValues.lineHeightMd?.toString(),
        
        color               : colorValues.primaryBold.toString(),
        
        '::selection' : {
            color           : colorValues.primaryText.toString(),
            backgroundColor : colorValues.primary.toString(),
        },
    },
    empty : {
        '::placeholder' : {
            // color           : `color-mix(in srgb, currentColor, ${(inputValues.placeholderOpacity as number) * 100}% transparent)`, // doesn't work
            // opacity         : inputValues.placeholderOpacity as number, // doesn't work
            color           : colorValues.primaryBold.alpha(inputValues.placeholderOpacity as number).toString(),
        },
    },
    complete : {
        color               : colorValues.successBold.toString(),
        '::selection' : {
            color           : colorValues.successText.toString(),
            backgroundColor : colorValues.success.toString(),
        },
    },
    invalid : {
        color               : colorValues.dangerBold.toString(),
        '::selection' : {
            color           : colorValues.dangerText.toString(),
            backgroundColor : colorValues.danger.toString(),
        },
    },
};



// react components:
export type CardBaseElementProps =
    |CardNumberElementProps
    |CardExpiryElementProps
    |CardCvcElementProps
export interface StripeCardFieldWrapperProps
    extends
        EditableTextControlProps
{
    // components:
    cardElementComponent : React.ReactElement<CardBaseElementProps>
}
const StripeCardFieldWrapper = (props: StripeCardFieldWrapperProps) => {
    // rest props:
    const {
        // components:
        cardElementComponent,
    ...restStripeCardFieldWrapperProps} = props;
    
    
    
    // styles:
    const styleSheet = useStripeCardFieldStyleSheet();
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean|undefined>(false);
    const [isValid  , setIsValid  ] = useState<boolean|undefined>(false);
    
    
    
    // handlers:
    const handleFocus = useEvent(() => {
        setIsFocused(true);
    });
    const handleBlur  = useEvent(() => {
        setIsFocused(false);
    });
    const handleChange = useEvent((event: StripeCardNumberElementChangeEvent|StripeCardExpiryElementChangeEvent|StripeCardCvcElementChangeEvent) => {
        setIsValid(!event.error);
    });
    
    
    
    // caches:
    const cachedCardField = useMemo(() => {
        // jsx:
        return React.cloneElement<CardBaseElementProps>(cardElementComponent,
            // props:
            {
                // options:
                options : {
                    style : style,
                },
                
                
                
                // classes:
                className : styleSheet.main,
                
                
                
                // hanlders:
                onFocus   : handleFocus,
                onBlur    : handleBlur,
                onChange  : handleChange,
            },
        );
    }, []);
    
    
    
    // default props:
    const {
        // accessibilities:
        tabIndex     : editableTabIndex  = -1,
        // 'aria-label' : editableAriaLabel = placeholder,
        
        
        
        // states:
        focused      : editableFocused   = isFocused ?? false,
        isValid      : editableIsValid   = isValid   ?? null,
        
        
        ...restEditableTextControlProps
    } = restStripeCardFieldWrapperProps;
    
    
    
    // jsx:
    return (
        <EditableTextControl
            // other props:
            {...restEditableTextControlProps}
            
            
            
            // accessibilities:
            tabIndex   = {editableTabIndex}
            // aria-label = {editableAriaLabel}
            
            
            
            // states:
            focused    = {editableFocused}
            isValid    = {editableIsValid}
        >
            {cachedCardField}
        </EditableTextControl>
    );
};
export {
    StripeCardFieldWrapper,
    StripeCardFieldWrapper as default,
};
