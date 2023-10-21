// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    RadioProps,
    Radio,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// handlers:
const handleRadioDecorator : React.MouseEventHandler<HTMLSpanElement> = (event) => {
    event.preventDefault();
    event.currentTarget.parentElement?.click();
}



// react components:
const RadioDecorator = (props: RadioProps) => {
    // jsx:
    return (
        <Radio
            // other props:
            {...props}
            
            
            
            // variants:
            outlined={props.outlined ?? true}
            nude={props.nude ?? true}
            
            
            
            // classes:
            className={props.className ?? 'decorator'}
            
            
            
            // accessibilities:
            enableValidation={props.enableValidation ?? false}
            inheritActive={props.inheritActive ?? true}
            tabIndex={props.tabIndex ?? -1}
            
            
            
            // handlers:
            onClick={props.onClick ?? handleRadioDecorator}
        />
    )
};
export {
    RadioDecorator,
    RadioDecorator as default,
}
