'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    ListProps,
    List,
    
    
    
    // menu-components:
    Dropdown,
    DropdownListExpandedChangeEvent,
    DropdownListProps,
    DropdownList,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals:
import {
    useCurrencyMenuStyleSheet,
}                           from '../styles/loader'

// configs:
import {
    paymentConfig,
}                           from '@/payment.config'



// react components:
export interface CurrencyDropdownProps<TElement extends Element = HTMLElement, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>
    extends
        // bases:
        DropdownListProps<TElement, TDropdownListExpandedChangeEvent>
{
    // states:
    navbarExpanded : boolean // out of <NavbarContextProvider>, we need to drill props the navbar's state
}
const CurrencyDropdown = (props: CurrencyDropdownProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCurrencyMenuStyleSheet();
    
    
    
    // rest props:
    const {
        // states:
        navbarExpanded,
        
        
        
        // components:
        listComponent = (<List /> as React.ReactComponentElement<any, ListProps>),
    ...restDropdownListProps} = props;
    
    
    
    // handlers:
    const handleClose = useEvent((event: React.MouseEvent<HTMLElement, MouseEvent>, data: string): void => {
        props.onExpandedChange?.({ expanded: false, actionType: 'ui', data: data });
        event.preventDefault();
    });
    
    
    
    // jsx:
    return (
        <DropdownList
            // other props:
            {...restDropdownListProps}
            
            
            
            // components:
            listComponent={listComponent}
            dropdownComponent={
                <Dropdown
                    // classes:
                    className={`${styleSheet.currencyDropdownDropdown} ${!navbarExpanded ? 'navbarCollapsed' : ''}`}
                >
                    {listComponent}
                </Dropdown>
            }
        >
            {paymentConfig.currencyOptions.map((currencyOption) =>
                <ListItem key={currencyOption} onClick={(event) => handleClose(event, currencyOption)}>
                    {currencyOption}
                </ListItem>
            )}
        </DropdownList>
    );
};
export {
    CurrencyDropdown,
    CurrencyDropdown as default,
}