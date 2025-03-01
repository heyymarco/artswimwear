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

// private components:
import {
    type CategoryExplorerProps,
    CategoryExplorer,
}                           from './CategoryExplorer'



// react components:
export interface CategoryExplorerDropdownProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<DropdownProps<TElement, DropdownExpandedChangeEvent<boolean>>,
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
const CategoryExplorerDropdown = <TElement extends Element = HTMLElement>(props: CategoryExplorerDropdownProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // appearances:
        mobileLayout = true,
        
        
        
        // other props:
        ...restDropdownProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useCategoryExplorerStyleSheet();
    
    
    
    // handlers:
    const handleNavigate = useEvent((): void => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : true,
        });
    });
    const handleClose = useEvent((): void => {
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
        >
            <CategoryExplorer
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
    CategoryExplorerDropdown,            // named export for readibility
    CategoryExplorerDropdown as default, // default export to support React.lazy
}
