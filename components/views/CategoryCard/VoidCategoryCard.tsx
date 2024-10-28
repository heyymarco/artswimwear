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
    // base-components:
    Generic,
    
    
    
    // layout-components:
    type ListItemProps,
    ListItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface VoidCategoryCardProps extends ListItemProps {
}
const VoidCategoryCard = (props: VoidCategoryCardProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryCardStyleSheet();
    
    
    
    // jsx:
    return (<>
        <ListItem
            // other props:
            {...props}
            
            
            
            // behaviors:
            actionCtrl={false}
            
            
            
            // classes:
            className={`${styleSheet.main} ${styleSheet.void}`}
        >
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
        </ListItem>
    </>);
};
export {
    VoidCategoryCard,
    VoidCategoryCard as default,
}
