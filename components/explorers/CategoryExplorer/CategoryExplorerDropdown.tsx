'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useCategoryExplorerStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // menu-components:
    DropdownProps,
    Dropdown,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// private components:
import {
    CategoryExplorer,
}                           from './CategoryExplorer'

// stores:
import {
    // hooks:
    useGetCategoryPage as _useGetCategoryPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface CategoryExplorerDropdownProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<DropdownProps<TElement>,
            // children:
            |'children' // already defined internally
        >
{
}
const CategoryExplorerDropdown = (props: CategoryExplorerDropdownProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryExplorerStyleSheet();
    
    
    
    // default props:
    const {
        // other props:
        ...restDropdownProps
    } = props;
    
    
    
    // handlers:
    const handleNavigate = useEvent(() => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : true,
        });
    });
    
    
    
    // jsx:
    return (
        <Dropdown
            // other props:
            {...restDropdownProps}
            
            
            
            // classes:
            className={`${styleSheet.dropdown} ${props.className}`}
        >
            <CategoryExplorer
                // handlers:
                onNavigate={handleNavigate}
            />
        </Dropdown>
    );
};
export {
    CategoryExplorerDropdown,
    CategoryExplorerDropdown as default,
}
