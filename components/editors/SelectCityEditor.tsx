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



// react components:
export interface SelectCityEditorProps<TElement extends Element = HTMLButtonElement>
    extends
        // bases:
        Omit<SelectZoneEditorProps<TElement>,
            |'modelName'
        >,
        Partial<Pick<SelectZoneEditorProps<TElement>,
            |'modelName'
        >>
{
}
const SelectCityEditor = <TElement extends Element = HTMLButtonElement>(props: SelectCityEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // data:
        modelName = 'City',
        
        
        
        // other props:
        ...restSelectZoneEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <SelectZoneEditor<TElement>
            // other props:
            {...restSelectZoneEditorProps}
            
            
            
            // data:
            modelName={modelName}
        />
    );
};
export {
    SelectCityEditor,            // named export for readibility
    SelectCityEditor as default, // default export to support React.lazy
}
