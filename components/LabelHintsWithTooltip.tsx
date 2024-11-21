// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    type IconProps,
    Icon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    type LabelWithTooltipProps,
    LabelWithTooltip,
}                           from '@/components/LabelWithTooltip'



// react components:
export interface LabelHintsWithTooltipProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        LabelWithTooltipProps<TElement>
{
    // appearances:
    icon          ?: IconProps['icon']
    
    
    
    // components:
    iconComponent ?: React.ReactElement<IconProps<Element>> | null
}
const LabelHintsWithTooltip = <TElement extends Element = HTMLSpanElement>(props: LabelHintsWithTooltipProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // appearances:
        icon,
        
        
        
        // variants:
        theme         = 'success',
        mild          = true,
        
        
        
        // components:
        iconComponent = (<Icon<Element> icon={icon as any} /> as React.ReactElement<IconProps<Element>>),
        
        
        
        // children:
        children      = <>
            {!!icon && !!iconComponent && React.cloneElement<IconProps<Element>>(iconComponent,
                // props:
                {
                    // appearances:
                    icon : icon,
                },
            )}
        </>,
        
        
        
        // other props:
        ...restLabelProps
    } = props;
    
    
    
    // jsx:
    return (
        <LabelWithTooltip<TElement>
            // other props:
            {...restLabelProps}
            
            
            
            // variants:
            theme={theme}
            mild={mild}
        >
            {children}
        </LabelWithTooltip>
    );
};
export {
    LabelHintsWithTooltip,            // named export for readibility
    LabelHintsWithTooltip as default, // default export to support React.lazy
}
