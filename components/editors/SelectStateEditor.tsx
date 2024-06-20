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
export interface SelectStateEditorProps<TElement extends Element = HTMLButtonElement>
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
const SelectStateEditor = <TElement extends Element = HTMLButtonElement>(props: SelectStateEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // data:
        modelName = 'State',
        
        
        
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
    SelectStateEditor,            // named export for readibility
    SelectStateEditor as default, // default export to support React.lazy
}
