'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useCategoryCardStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // layout-components:
    type ListItemProps,
    ListItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface EmptyCategoryCardProps extends ListItemProps {
}
const EmptyCategoryCard = (props: EmptyCategoryCardProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryCardStyleSheet();
    
    
    
    // default props:
    const {
        // variants:
        theme      = 'secondary',
        mild       = false,
        
        
        
        // classes:
        className  = '',
        
        
        
        // behaviors:
        actionCtrl = false,
        
        
        
        // other props:
        ...restListItemProps
    } = props;
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // variants:
            theme={theme}
            mild={mild}
            
            
            
            // classes:
            className={`${styleSheet.main} ${styleSheet.empty} ${className}`}
            
            
            
            // behaviors:
            actionCtrl={actionCtrl}
        >
            {/* #region just for preserving the consistent size to regular <CategoryCard> */}
            {/* image (single image) -or- carousel (multi images) */}
            <div
                // classes:
                className='preview'
            >
                <div
                    // classes:
                    className='image'
                />
            </div>
            {/* #endregion just for preserving the consistent size to regular <CategoryCard> */}
            
            <p className='emptyMessage txt-sec'>
                There are no more subcategories.
            </p>
        </ListItem>
    );
};
export {
    EmptyCategoryCard,
    EmptyCategoryCard as default,
}
