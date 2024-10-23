'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useCategoryViewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    type ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
import {
    ModelImage,
}                           from '@/components/views/ModelImage'

// models:
import {
    type CategoryPreview,
}                           from '@/models'



// defaults:
const minImageWidth = 55;  // 55px === (50px + (2* paddingBlock)) * aspectRatio === (50px + (2* 16px)) * 2/3



// react components:
export interface CategoryViewProps extends ModelPreviewProps<CategoryPreview> {
    // values:
    selectedModel ?: CategoryPreview|null
    onModelSelect ?: EditorChangeEventHandler<CategoryPreview>
}
const CategoryView = (props: CategoryViewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryViewStyleSheet();
    
    
    
    // props:
    const {
        // data:
        model,
        
        
        
        // values:
        selectedModel,
        onModelSelect,
        
        
        
        // other props:
        ...restCategoryViewProps
    } = props;
    const {
        id,
        name,
        image = null,
    } = model;
    
    
    
    // handlers:
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // conditions:
        if (!event.currentTarget.contains(event.target as Node)) return; // ignore bubbling from <portal> of <EditCategoryDialog>
        
        
        
        // actions:
        onModelSelect?.(model);
    });
    
    
    
    // default props:
    const {
        // states:
        active     = (selectedModel?.id === id),
        
        
        
        // other props:
        ...restListItemProps
    } = restCategoryViewProps;
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // behaviors:
            actionCtrl={true}
            
            
            
            // classes:
            className={styleSheet.main}
            
            
            
            // states:
            active={active}
            
            
            
            // handlers:
            onClick={handleClick}
        >
            <h3 className='name'>
                {name}
            </h3>
            
            {/* image (single image) -or- carousel (multi images) */}
            <Basic
                // variants:
                mild={true}
                
                
                
                // classes:
                className='preview'
            >
                <ModelImage
                    // appearances:
                    alt={name}
                    src={image}
                    sizes={`${minImageWidth}px`}
                    
                    
                    
                    // behaviors:
                    priority={false}
                    
                    
                    
                    // classes:
                    className='image'
                />
            </Basic>
        </ListItem>
    );
};
export {
    CategoryView,
    CategoryView as default,
}
