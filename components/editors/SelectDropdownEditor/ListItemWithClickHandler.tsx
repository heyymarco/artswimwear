// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItemProps,
    ListItem,
    ListItemComponentProps,
    
    
    
    // menu-components:
    DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/components'



// react components:
export interface ListItemWithClickHandlerProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>,
        
        // components:
        Required<ListItemComponentProps<TElement>>
{
}
const ListItemWithClickHandler = <TElement extends Element = HTMLElement, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<any> = DropdownListExpandedChangeEvent<any>>(props: ListItemWithClickHandlerProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        listItemComponent,
        
        
        
        // other props:
        ...restListItemWithClickHandler
    } = props;
    
    
    
    // handlers:
    const handleClick = useMergeEvents(
        // preserves the original `onClick` from `listItemComponent`:
        listItemComponent.props.onClick,
        
        
        
        // preserves the original `onClick` from `props`:
        props.onClick,
    );
    
    
    
    // jsx:
    /* <ListItem> */
    return React.cloneElement<ListItemProps<TElement>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemWithClickHandler,
            
            
            
            // handlers:
            onClick : handleClick,
        },
    );
};
export {
    ListItemWithClickHandler,
    ListItemWithClickHandler as default,
}
