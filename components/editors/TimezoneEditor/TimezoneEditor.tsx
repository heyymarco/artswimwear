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
    // react components:
    type SelectDropdownEditorProps,
    SelectDropdownEditor,
}                           from '@heymarco/select-dropdown-editor'

// internals:
import {
    possibleTimezoneValues,
}                           from './types'
import {
    convertTimezoneToReadableClock,
}                           from './utilities'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// utilities:
const defaultValueToUi = (value: number|null) => (value !== null) ? <>GMT{convertTimezoneToReadableClock(value)}</> : null;



// react components:
export interface TimezoneEditorProps<TElement extends Element = HTMLButtonElement>
    extends
        // bases:
        Omit<SelectDropdownEditorProps<TElement, number>,
            // values:
            |'valueOptions'
        >
{
}
const TimezoneEditor = <TElement extends Element = HTMLButtonElement>(props: TimezoneEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Timezone',
        
        
        
        // values:
        valueToUi    = defaultValueToUi,
        
        defaultValue = checkoutConfigShared.intl.defaultTimezone,
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props satisfies NoForeignProps<typeof props, Omit<SelectDropdownEditorProps<TElement, number>, 'valueOptions'>>;
    
    
    
    // jsx:
    return (
        <SelectDropdownEditor
            // other props:
            {...restSelectDropdownEditorProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // values:
            valueOptions={possibleTimezoneValues}
            valueToUi={valueToUi}
            
            defaultValue={defaultValue}
        />
    );
};
export {
    TimezoneEditor,
    TimezoneEditor as default,
}
