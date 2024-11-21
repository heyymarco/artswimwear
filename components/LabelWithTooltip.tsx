// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type LabelProps,
    Label,
    
    
    
    // notification-components:
    type TooltipProps,
    Tooltip,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// react components:
export interface LabelWithTooltipProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        LabelProps<TElement>
{
    // components:
    /**
     * The underlying `<Label>` to be <Tooltip>ed.
     */
    labelComponent   ?: React.ReactElement<LabelProps<TElement>>
    tooltipComponent ?: React.ReactElement<TooltipProps<Element>>
    
    
    
    // children:
    tooltipChildren  ?: React.ReactNode
}
const LabelWithTooltip = <TElement extends Element = HTMLSpanElement>(props: LabelWithTooltipProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        
        
        
        // components:
        labelComponent   = (<Label<TElement>  /> as React.ReactElement<LabelProps<TElement>>),
        tooltipComponent = (<Tooltip<Element> /> as React.ReactElement<TooltipProps<Element>>),
        
        
        
        // children:
        children,
        tooltipChildren,
        
        
        
        // other props:
        ...restLabelProps
    } = props;
    
    
    
    // refs:
    const labelRefInternal = useRef<TElement|null>(null);
    const mergedElmRef     = useMergeRefs(
        // preserves the original `elmRef` from `labelComponent`:
        labelComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        labelRefInternal,
    );
    
    
    
    // default props:
    const {
        // variants:
        theme      : tooltipComponentTheme      = 'warning',
        
        
        
        // floatable:
        floatingOn : tooltipComponentFloatingOn = labelRefInternal,
        
        
        
        // children:
        children   : tooltipComponentChildren   = tooltipChildren,
        
        
        
        // other props:
        ...restTooltipComponentProps
    } = tooltipComponent.props;
    
    
    
    // jsx:
    return React.cloneElement<LabelProps<TElement>>(labelComponent,
        // props:
        {
            // other props:
            ...restLabelProps,
            ...labelComponent.props, // overwrites restLabelProps (if any conflics)
            
            
            
            // refs:
            elmRef : mergedElmRef,
        },
        
        
        
        // children:
        children,
        React.cloneElement<TooltipProps<Element>>(tooltipComponent,
            // props:
            {
                // other props:
                ...restTooltipComponentProps,
                
                
                
                // variants:
                theme      : tooltipComponentTheme,
                
                
                
                // floatable:
                floatingOn : tooltipComponentFloatingOn,
            },
            
            
            
            // children:
            tooltipComponentChildren,
        ),
    );
};
export {
    LabelWithTooltip,            // named export for readibility
    LabelWithTooltip as default, // default export to support React.lazy
}
