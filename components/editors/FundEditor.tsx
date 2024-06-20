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
export interface FundEditorProps<TElement extends Element = HTMLDivElement>
    extends
        // bases:
        NumberEditorProps<TElement>
{
    // appearances:
    currency         ?: string
    
    currencySign     ?: string
    currencyFraction ?: number
}
const FundEditor = <TElement extends Element = HTMLDivElement>(props: FundEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,         // take, moved to <NumberEditor>
        outerRef,       // take, moved to <Group>
        
        
        
        // identifiers:
        id,             // take, moved to <Group>
        
        
        
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
        size,           // take, moved to <Group>
        theme,          // take, moved to <Group>
        gradient,       // take, moved to <Group>
        outlined,       // take, moved to <Group>
        mild,           // take, moved to <Group>
        
        
        
        // classes:
        mainClass,      // take, moved to <Group>
        classes,        // take, moved to <Group>
        variantClasses, // take, moved to <Group>
        stateClasses,   // take, moved to <Group>
        className,      // take, moved to <Group>
        
        
        
        // styles:
        style,          // take, moved to <Group>
        
        
        
        // other props:
        ...restFundEditorProps
    } = props;
    
    
    
    // default props:
    const {
        // validations:
        required = true,
        min      = 0,
        step     = currencyFraction ? (1/(10 ** currencyFraction)) : undefined,
        
        
        
        // other props:
        ...restNumberEditorProps
    } = restFundEditorProps;
    
    
    
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
                required={required}
                min={min}
                step={step}
            />
        </Group>
    );
};
export {
    FundEditor,            // named export for readibility
    FundEditor as default, // default export to support React.lazy
}
