'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIconProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// models:
import type {
    BusyState,
}                           from '@/models'

// internals:
import {
    // states:
    useCheckoutState,
}                           from '../states/checkoutState'



// react components:
export interface ButtonWithBusyProps
    extends
        // bases:
        Omit<ButtonIconProps,
            // components:
            |'buttonComponent' // upgraded from <Button> to <ButtonIcon>
        >
{
    // appearances:
    iconBusy        ?: ButtonIconProps['icon']
    
    
    
    // behaviors:
    busyType        ?: BusyState
    
    
    
    // components:
    buttonComponent  : React.ReactElement<ButtonIconProps>
}
const ButtonWithBusy = (props: ButtonWithBusyProps): JSX.Element|null => {
    // states:
    const {
        // states:
        isBusy,
    } = useCheckoutState();
    
    
    
    // rest props:
    const {
        // appearances:
        iconBusy = 'busy',
        
        
        
        // behaviors:
        busyType,
        
        
        
        // components:
        buttonComponent : buttonIconComponent,
        
        
        
        // other props:
        ...restButtonIconProps
    } = props;
    
    
    
    // states:
    const isBusyOfType = (busyType === undefined) ? !!isBusy : (isBusy === busyType);
    
    
    
    // refs:
    const mergedElmRef   = useMergeRefs(
        // preserves the original `elmRef` from `buttonIconComponent`:
        buttonIconComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        props.elmRef,
    );
    const mergedOuterRef = useMergeRefs(
        // preserves the original `outerRef` from `buttonIconComponent`:
        buttonIconComponent.props.outerRef,
        
        
        
        // preserves the original `outerRef` from `props`:
        props.outerRef,
    );
    
    
    
    // default props:
    const {
        // appearances
        icon : buttonIconComponentIcon = undefined,
        
        
        
        // other props:
        ...restButtonIconComponentProps
    } = buttonIconComponent.props;
    
    
    
    // jsx:
    return React.cloneElement<ButtonIconProps>(buttonIconComponent,
        // props:
        {
            // other props:
            ...restButtonIconProps,
            ...restButtonIconComponentProps, // overwrites restButtonIconProps (if any conflics)
            
            
            
            // refs:
            elmRef   : mergedElmRef,
            outerRef : mergedOuterRef,
            
            
            
            // appearances:
            icon     : (isBusyOfType ? iconBusy : buttonIconComponentIcon),
        },
    );
};
export {
    ButtonWithBusy,
    ButtonWithBusy as default,
};
