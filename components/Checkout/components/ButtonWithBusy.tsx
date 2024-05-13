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
    ButtonProps,
    ButtonComponentProps,
    
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
        ButtonProps,
        
        // components:
        Required<Pick<ButtonComponentProps,
            'buttonComponent' // a required underlying <Button>
        >>
{
    // appearances:
    iconBusy ?: ButtonIconProps['icon']
    
    
    
    // behaviors:
    busyType ?: BusyState
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
        buttonComponent,
    ...restButtonIconProps} = props;
    
    
    
    
    // fn props:
    const isBusyType = !busyType ? isBusy : (isBusy === busyType);
    const icon       = (buttonComponent?.props as ButtonIconProps|undefined)?.icon;
    
    
    
    // refs:
    const mergedElmRef   = useMergeRefs(
        // preserves the original `elmRef` from `buttonComponent`:
        buttonComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        props.elmRef,
    );
    const mergedOuterRef = useMergeRefs(
        // preserves the original `outerRef` from `buttonComponent`:
        buttonComponent.props.outerRef,
        
        
        
        // preserves the original `outerRef` from `props`:
        props.outerRef,
    );
    
    
    
    // jsx:
    /* <Button> or <ButtonIcon> */
    return React.cloneElement<ButtonIconProps>(buttonComponent,
        // props:
        {
            // other props:
            ...restButtonIconProps,
            ...buttonComponent.props, // overwrites restButtonIconProps (if any conflics)
            
            
            
            // refs:
            elmRef   : mergedElmRef,
            outerRef : mergedOuterRef,
            
            
            
            // appearances:
            icon     : !icon ? undefined : (isBusyType ? iconBusy : icon),
        },
    );
};
export {
    ButtonWithBusy,
    ButtonWithBusy as default,
};
