'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// styles:
import {
    useSearchExplorerStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // menu-components:
    type DropdownExpandedChangeEvent,
    type DropdownProps,
    Dropdown,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type CartState,
}                           from '@/components/Cart'

// private components:
import {
    type SearchExplorerProps,
    SearchExplorer,
}                           from './SearchExplorer'



// react components:
export interface SearchExplorerDropdownProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<DropdownProps<TElement, DropdownExpandedChangeEvent<boolean>>,
            // children:
            |'children' // already defined internally
        >,
        
        // components:
        Pick<SearchExplorerProps,
            // appearances:
            |'mobileLayout'
        >
{
}
const SearchExplorerDropdown = <TElement extends Element = HTMLElement>(props: SearchExplorerDropdownProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // appearances:
        mobileLayout = true,
        
        
        
        // other props:
        ...restDropdownProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useSearchExplorerStyleSheet();
    
    
    
    // refs:
    const searchInputRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleNavigate = useEvent(() => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : true,
        });
    });
    const handleClose = useEvent(() => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : false,
        });
    });
    
    
    
    // jsx:
    return (
        <Dropdown<TElement, DropdownExpandedChangeEvent<boolean>>
            // other props:
            {...restDropdownProps satisfies NoForeignProps<typeof restDropdownProps, Omit<DropdownProps<TElement, DropdownExpandedChangeEvent<boolean>>, 'children'>>}
            
            
            
            // classes:
            className={`${styleSheet.dropdown} ${mobileLayout ? 'mobile' : ''} ${props.className ?? ''}`}
            
            
            
            // auto focusable:
            autoFocusOn={searchInputRef}
        >
            <SearchExplorer
                // refs:
                searchInputRef={searchInputRef}
                
                
                
                // appearances:
                mobileLayout={mobileLayout}
                
                
                
                // handlers:
                onNavigate={handleNavigate}
                onClose={handleClose}
            />
        </Dropdown>
    );
};
export {
    SearchExplorerDropdown,            // named export for readibility
    SearchExplorerDropdown as default, // default export to support React.lazy
}
