// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    type SelectZoneEditorProps,
    SelectZoneEditor,
}                           from '@/components/editors/SelectZoneEditor'

// privates:
import {
    getCountryDisplay,
    countryList,
}                           from './utilities'
import {
    DummyTextEditor,
}                           from './DummyTextEditor'



// react components:
export interface SelectCountryEditorProps<TElement extends Element = HTMLButtonElement>
    extends
        // bases:
        Omit<SelectZoneEditorProps<TElement>,
            // data:
            |'modelName'    // changed to optional
            
            // values:
            |'valueOptions' // changed to optional
        >,
        Partial<Pick<SelectZoneEditorProps<TElement>,
            // data:
            |'modelName'    // changed to optional
            
            // values:
            |'valueOptions' // changed to optional
        >>
{
}
const SelectCountryEditor = <TElement extends Element = HTMLButtonElement>(props: SelectCountryEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // data:
        modelName               = 'Country',
        
        
        
        // accessibilities:
        'aria-label'            : ariaLabel = 'Select Country',
        placeholder             = ariaLabel,
        
        
        
        // values:
        valueOptions            = countryList,
        valueToUi               = getCountryDisplay,
        
        
        
        // validations:
        freeTextInput           = false,
        
        
        
        // behaviors:
        preferFocusOnTextEditor = false,
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <SelectZoneEditor<TElement>
            // other props:
            {...restSelectDropdownEditorProps}
            
            
            
            // data:
            modelName={modelName}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            placeholder={placeholder}
            
            
            
            // values:
            valueOptions={valueOptions}
            valueToUi={valueToUi}
            
            
            
            // validations:
            freeTextInput={freeTextInput}
            
            
            
            // behaviors:
            preferFocusOnTextEditor={preferFocusOnTextEditor}
            
            
            
            // components:
            textEditorComponent={
                <DummyTextEditor
                    // values:
                    valueToUi={valueToUi}
                    
                    
                    
                    // validations:
                    minLength={2}
                    maxLength={2}
                />
            }
        />
    );
};
export {
    SelectCountryEditor,            // named export for readibility
    SelectCountryEditor as default, // default export to support React.lazy
}
