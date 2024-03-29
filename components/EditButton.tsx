// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    ButtonIconProps,
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



export interface EditButtonProps extends ButtonIconProps
{
}
const EditButton = (props: EditButtonProps) => {
    // jsx:
    return (
        <ButtonIcon
            // other props:
            {...props}
            
            
            
            // appearances:
            icon={props.icon ?? 'edit'}
            
            
            
            // variants:
            size={props.size ?? 'sm'}
            buttonStyle={props.buttonStyle ?? 'link'}
            
            
            
            // classes:
            className={props.className ?? 'edit'}
            
            
            
            // accessibilities:
            title={props.title ?? 'edit'}
        >
            {props.children ?? 'Edit'}
        </ButtonIcon>
    );
};
export {
    EditButton,
    EditButton as default,
}
