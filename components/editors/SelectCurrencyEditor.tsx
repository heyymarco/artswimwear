// react:
import {
    // react:
    default as React,
}                           from 'react'

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
        SelectDropdownEditorProps<TElement, React.MouseEvent<Element, MouseEvent>, string>
{
}
const SelectCurrencyEditor = <TElement extends Element = HTMLButtonElement>(props: SelectCurrencyEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // values:
        valueOptions = Object.keys(checkoutConfigShared.intl.currencies), // defaults to currencies in config
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <SelectDropdownEditor<TElement, React.MouseEvent<Element, MouseEvent>, string>
            // other props:
            {...restSelectDropdownEditorProps}
            
            
            
            // values:
            valueOptions={valueOptions}
            
            
            
            // floatable:
            floatingPlacement='bottom'
        />
    );
};
export {
    SelectCurrencyEditor,            // named export for readibility
    SelectCurrencyEditor as default, // default export to support React.lazy
}
