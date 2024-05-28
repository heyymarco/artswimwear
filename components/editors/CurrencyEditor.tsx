// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    Label,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // react components:
    NumberEditorProps,
    NumberEditor,
}                           from '@/components/editors/NumberEditor'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// react components:
export interface CurrencyEditorProps<TElement extends Element = HTMLDivElement>
    extends
        // bases:
        NumberEditorProps<TElement>
{
    // appearances:
    currency         ?: string
    
    currencySign     ?: string
    currencyFraction ?: number
}
const CurrencyEditor = <TElement extends Element = HTMLDivElement>(props: CurrencyEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // appearances:
        currency,
        
        currencySign     = (
            !!currency
            ? (checkoutConfigShared.intl.currencies[currency] ?? checkoutConfigShared.intl.currencies[checkoutConfigShared.intl.defaultCurrency]).sign
            : undefined
        ),
        currencyFraction = (
            !!currency
            ? (checkoutConfigShared.intl.currencies[currency] ?? checkoutConfigShared.intl.currencies[checkoutConfigShared.intl.defaultCurrency]).fractionMax
            : undefined
        ),
        
        
        
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        mainClass,
        classes,
        variantClasses,
        stateClasses,
        className,
        
        
        
        // styles:
        style,
    ...restNumberEditorProps} = props;
    
    
    
    // jsx:
    return (
        <Group
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // variants:
            size={size}
            theme={theme}
            gradient={gradient}
            outlined={outlined}
            mild={mild}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            {!!currencySign && <Label
                // classes:
                className='solid'
            >
                {currencySign}
            </Label>}
            <NumberEditor<TElement>
                // other props:
                {...restNumberEditorProps}
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // classes:
                className='fluid'
                
                
                
                // validations:
                required={props.required ?? true}
                min={props.min ?? 0}
                step={currencyFraction ? (1/(10 ** currencyFraction)) : undefined}
            />
        </Group>
    );
};
export {
    CurrencyEditor,
    CurrencyEditor as default,
}
