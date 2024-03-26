// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useMergeClasses,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    RadioProps,
    Radio,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// styles:
const useRadioDecoratorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./RadioDecoratorStyles')
, { specificityWeight: 2, id: 'wrg5q7no8b' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './RadioDecoratorStyles';



// handlers:
const handleRadioDecorator : React.MouseEventHandler<HTMLSpanElement> = (event) => {
    event.preventDefault();
    event.currentTarget.parentElement?.click();
}



// react components:
export interface RadioDecoratorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        RadioProps<TElement>
{
}
const RadioDecorator = (props: RadioProps) => {
    // styles:
    const styleSheet = useRadioDecoratorStyleSheet();
    
    
    
    // classes:
    const mergedClasses = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // hacks:
        styleSheet.main,
    );
    
    
    
    // jsx:
    return (
        <Radio
            // other props:
            {...props}
            
            
            
            // variants:
            outlined={props.outlined ?? true} // show the <Parent>'s background
            nude={props.nude ?? true} // no outer layout
            
            
            
            // classes:
            classes={mergedClasses}
            
            
            
            // accessibilities:
            enableValidation={props.enableValidation ?? false} // no validation
            inheritActive={props.inheritActive ?? true} // follows the <Parent>'s active
            tabIndex={props.tabIndex ?? -1} // unfocusable, focus on the <Parent>
            
            
            
            // handlers:
            onClick={props.onClick ?? handleRadioDecorator} // forwards click to <Parent> while preserving the hover effect (without `pointerEvent: 'none'`)
        />
    )
};
export {
    RadioDecorator,
    RadioDecorator as default,
}



export interface RadioDecoratorComponentProps
{
    // components:
    radioDecoratorComponent ?: React.ReactComponentElement<any, RadioDecoratorProps<Element>>|null
}
