'use client'

// styles:
import {
    useBaseCardFieldWrapperStyleSheet,
}                           from './styles/loader'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // base-components:
    EditableTextControlProps,
    EditableTextControl,
    useEditableTextControlStyleSheet,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// react components:
export interface BaseCardFieldWrapperProps
    extends
        // bases:
        EditableTextControlProps
{
    // formats:
    placeholder ?: string
}
const BaseCardFieldWrapper = (props: BaseCardFieldWrapperProps) => {
    // props:
    const {
        // formats:
        placeholder,
        
        
        
        // other props:
        ...restBaseCardFieldWrapperProps
    } = props;// styles:
    
    
    
    const baseStyleSheets = useEditableTextControlStyleSheet();
    const styleSheets     = useBaseCardFieldWrapperStyleSheet();
    
    
    
    // default props:
    const {
        // classes:
        mainClass    : editableMainClass = `${baseStyleSheets.main} ${styleSheets.main}`,
        
        
        
        // accessibilities:
        tabIndex     : editableTabIndex  = -1,
        
        
        
        // formats:
        'aria-label' : editableAriaLabel = placeholder,
        
        
        
        // other props:
        ...restEditableTextControlProps
    } = restBaseCardFieldWrapperProps;
    
    
    
    // jsx:
    return (
        <EditableTextControl
            // other props:
            {...restEditableTextControlProps}
            
            
            
            // classes:
            mainClass  = {editableMainClass}
            
            
            
            // accessibilities:
            tabIndex   = {editableTabIndex}
            
            
            
            // formats:
            aria-label = {editableAriaLabel}
        />
    );
};
export {
    BaseCardFieldWrapper,
    BaseCardFieldWrapper as default,
};
