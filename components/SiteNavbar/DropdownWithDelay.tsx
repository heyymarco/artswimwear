// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // menu-components:
    type DropdownExpandedChangeEvent,
    type DropdownProps,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface DropdownWithDelayProps<TElement extends Element = HTMLElement, TData extends any = any, TModalExpandedChangeEvent extends DropdownExpandedChangeEvent<TData> = DropdownExpandedChangeEvent<TData>>
    extends
        // bases:
        Omit<DropdownProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'
        >
{
    // components:
    dropdownUiComponent : React.ReactElement<DropdownProps<TElement, TModalExpandedChangeEvent>>
}
/**
 * Ensures the `expanded` prop is not immediately assigned as `true`, instead assigned as `false` then assigned later as `true`.
 */
const DropdownWithDelay = <TElement extends Element = HTMLElement, TData extends any = any, TModalExpandedChangeEvent extends DropdownExpandedChangeEvent<TData> = DropdownExpandedChangeEvent<TData>>(props: DropdownWithDelayProps<TElement, TData, TModalExpandedChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        dropdownUiComponent,
        
        
        
        // other props:
        ...restModalBaseProps
    } = props;
    
    
    
    // states:
    const [loaded, setLoaded] = useState<boolean>(false);
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        let cancelRequest = requestAnimationFrame(() => {
            cancelRequest = requestAnimationFrame(() => {
                setLoaded(true);
            });
        });
        
        
        
        // cleanups:
        return () => {
            cancelAnimationFrame(cancelRequest);
        };
    }, []);
    
    
    
    // jsx:
    return React.cloneElement<DropdownProps<TElement, TModalExpandedChangeEvent>>(dropdownUiComponent,
        // props:
        {
            // other props:
            ...restModalBaseProps satisfies NoForeignProps<typeof restModalBaseProps, Omit<DropdownProps<TElement, TModalExpandedChangeEvent>, 'children'>>,
            ...dropdownUiComponent.props, // overwrites restModalBaseProps (if any conflics)
            
            
            
            // states:
            expanded : loaded && (dropdownUiComponent.props.expanded ?? props.expanded ?? false),
        },
    );
};
export {
    DropdownWithDelay,
    DropdownWithDelay as default,
}
