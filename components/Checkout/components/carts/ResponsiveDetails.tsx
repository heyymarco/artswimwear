'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // a set of React node utility functions:
    isTruthyNode,
    
    
    
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // composite-components:
    DetailsProps,
    Details,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
interface ResponsiveDetailsProps<TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>
    extends
        // bases:
        DetailsProps<TElement, TExpandedChangeEvent>
{
    // accessibilities:
    title ?: React.ReactNode
}
const ResponsiveDetails = <TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: ResponsiveDetailsProps<TElement, TExpandedChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        title,
        
        
        
        // states:
        defaultExpanded = false,
        
        
        
        // children:
        children,
    ...restDetailsProps} = props;
    
    
    
    // states:
    const {
        // states:
        isDesktop,
    } = useCheckoutState();
    
    const [showDetails, setShowDetails] = useState<boolean>(defaultExpanded);
    
    
    
    // handlers:
    const handleExpandedChangeInternal = useEvent<EventHandler<TExpandedChangeEvent>>((event) => {
        setShowDetails(event.expanded);
    });
    const handleExpandedChange         = useMergeEvents(
        // preserves the original `onExpandedChange`:
        props.onExpandedChange,
        
        
        
        // actions:
        handleExpandedChangeInternal,
    );
    
    
    
    // jsx:
    if (isDesktop) return (
        <>
            {children}
        </>
    );
    return (
        <Details<TElement, TExpandedChangeEvent>
            // other props:
            {...restDetailsProps}
            
            
            
            // states:
            expanded={props.expanded ?? showDetails}
            
            
            
            // components:
            buttonChildren={
                props.buttonChildren
                ??
                <>
                    {`${showDetails ? 'Hide' : 'Show' }${isTruthyNode(title) ? ' ' : ''}`}
                    {title}
                </>
            }
            
            
            
            // handlers:
            onExpandedChange={handleExpandedChange}
        >
            {children}
        </Details>
    );
};
export {
    ResponsiveDetails,
    ResponsiveDetails as default,
}
