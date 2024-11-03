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
    type CategoryExplorerProps,
    CategoryExplorer,
}                           from './CategoryExplorer'



// react components:
export interface CategoryExplorerDropdownProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<DropdownProps<TElement>,
            // children:
            |'children' // already defined internally
        >,
        
        // components:
        Pick<CategoryExplorerProps,
            // appearances:
            |'mobileLayout'
        >
{
}
const CategoryExplorerDropdown = (props: CategoryExplorerDropdownProps): JSX.Element|null => {
    // props:
    const {
        // appearances:
        mobileLayout = false,
        
        
        
        // other props:
        ...restCategoryExplorerDropdownProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useCategoryExplorerStyleSheet();
    
    
    
    // handlers:
    const handleNavigate = useEvent(() => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : true,
        });
    });
    
    
    
    // default props:
    const {
        // other props:
        ...restDropdownProps
    } = restCategoryExplorerDropdownProps;
    
    
    
    // jsx:
    return (
        <Dropdown
            // other props:
            {...restDropdownProps}
            
            
            
            // classes:
            className={`${mobileLayout ? '' : styleSheet.dropdown} ${props.className}`}
        >
            <CategoryExplorer
                // appearances:
                mobileLayout={mobileLayout}
                
                
                
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
