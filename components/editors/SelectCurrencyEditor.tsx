// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    SelectDropdownEditorProps,
    SelectDropdownEditor,
}                           from '@heymarco/select-dropdown-editor'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// react components:
export interface SelectCurrencyEditorProps<TElement extends Element = HTMLButtonElement>
    extends
        // bases:
        Omit<SelectDropdownEditorProps<TElement, string>,
            // values:
            |'valueOptions' // changed to optional
        >,
        Partial<Pick<SelectDropdownEditorProps<TElement, string>,
            // values:
            |'valueOptions' // changed to optional
        >>
{
}
const SelectCurrencyEditor = <TElement extends Element = HTMLButtonElement>(props: SelectCurrencyEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // values:
        valueOptions = checkoutConfigShared.payment.currencyOptions, // defaults to currencies in config
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props satisfies NoForeignProps<typeof props, Omit<SelectDropdownEditorProps<TElement, string>, 'valueOptions'> & Partial<Pick<SelectDropdownEditorProps<TElement, string>, 'valueOptions'>>>;
    
    
    
    // jsx:
    return (
        <SelectDropdownEditor<TElement, string>
            // other props:
            {...restSelectDropdownEditorProps}
            
            
            
            // values:
            valueOptions={valueOptions}
        />
    );
};
export {
    SelectCurrencyEditor,            // named export for readibility
    SelectCurrencyEditor as default, // default export to support React.lazy
}
