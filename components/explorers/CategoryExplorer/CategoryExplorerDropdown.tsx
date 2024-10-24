'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useCategoryFullMenuStyleSheet,
}                           from './styles/loader'

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
    const styleSheet = useCategoryFullMenuStyleSheet();
    
    
    
    // default props:
    const {
        // other props:
        ...restDropdownProps
    } = props;
    
    
    
    // jsx:
    return (
        <Dropdown
            // other props:
            {...restDropdownProps}
            
            
            
            // classes:
            className={`${styleSheet.dropdown} ${props.className}`}
        >
            <CategoryExplorer />
        </Dropdown>
    );
};
export {
    CategoryExplorerDropdown,
    CategoryExplorerDropdown as default,
}
