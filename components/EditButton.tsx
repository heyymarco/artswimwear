// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    type ButtonIconProps,
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// react components:
export interface EditButtonProps
    extends
        // bases:
        ButtonIconProps
{
}
const EditButton = (props: EditButtonProps) => {
    // default props:
    const {
        // appearances:
        icon        = 'edit',
        
        
        
        // variants:
        size        = 'sm',
        buttonStyle = 'link',
        
        
        
        // classes:
        className   = 'edit',
        
        
        
        // accessibilities:
        title       = 'Edit',
        
        
        
        // children:
        children    = 'Edit',
        
        
        
        // other props:
        ...buttonIconProps
    } = props;
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // other props:
            {...buttonIconProps}
            
            
            
            // appearances:
            icon={icon}
            
            
            
            // variants:
            size={size}
            buttonStyle={buttonStyle}
            
            
            
            // classes:
            className={className}
            
            
            
            // accessibilities:
            title={title}
        >
            {children}
        </ButtonIcon>
    );
};
export {
    EditButton,            // named export for readibility
    EditButton as default, // default export to support React.lazy
}
