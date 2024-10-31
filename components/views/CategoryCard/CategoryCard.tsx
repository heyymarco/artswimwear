'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useMemo,
}                           from 'react'

// next-js:
import {
    // navigations:
    useRouter,
}                           from 'next/navigation'

// styles:
import {
    useCategoryCardStyleSheet,
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
    ModelImage,
}                           from '@/components/views/ModelImage'
import {
    // states:
    useCategoryExplorerState,
}                           from '@/components/explorers/CategoryExplorer/states/categoryExplorerState'
import {
    PrefetchCategoryPage,
}                           from '@/components/prefetches/PrefetchCategoryPage'
import {
    PrefetchProductPage,
}                           from '@/components/prefetches/PrefetchProductPage'
import {
    PrefetchCategoryDetail,
}                           from '@/components/prefetches/PrefetchCategoryDetail'

// models:
import {
    // types:
    type CategoryPreview,
    
    
    
    // defaults:
    defaultProductPerPage,
}                           from '@/models'



// defaults:
// const maxGalleryItemWidth = 534; // 534px = (255*2) + (16 * 1.5) = 534
const minImageWidth = 44;  // 44px === (50px + (2* paddingBlock)) * aspectRatio === (50px + (2* 8px)) * 2/3



// react components:
export interface CategoryCardProps extends ModelPreviewProps<CategoryPreview> {
    // values:
    selectedModel  ?: CategoryPreview|null
    onModelSelect  ?: EditorChangeEventHandler<CategoryPreview>
}
const CategoryCard = (props: CategoryCardProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryCardStyleSheet();
    
    
    
    // props:
    const {
        // data:
        model,
        
        
        
        // values:
        selectedModel,
        onModelSelect,
        
        
        
        // other props:
        ...restCategoryCardProps
    } = props;
    const {
        id,
        name,
        image = null,
        hasSubcategories,
        path,
    } = model;
    
    
    
    // states:
    const {
        // states:
        parentCategories,
        
        
        
        // handlers:
        onNavigate,
    } = useCategoryExplorerState();
    
    
    
    // navigations:
    const router                    = useRouter();
    const hierarchyPathsUnstable : string[] = [
        ...parentCategories.map(({category: {path}}) => path),
        path,
    ];
    const categoryBasePath          = hierarchyPathsUnstable.join('/');
    const hierarchyPaths            = useMemo<string[]>(() =>
        hierarchyPathsUnstable
    , [categoryBasePath]);
    const categoryInterceptedPath   =   `/categories/${categoryBasePath}`;
    const categoryUninterceptedPath = `/_/categories/${categoryBasePath}`;
    
    
    
    // refs:
    const articleRef = useRef<HTMLDivElement|null>(null);
    
    
    
    // handlers:
    const handleNavigate = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault(); // prevents the actual `href` to havigate
        
        
        
        // actions:
        if (hasSubcategories) {
            onModelSelect?.(model);                 // navigate to subcategory
        }
        else {
            router.push(categoryUninterceptedPath); // goto unintercepted category page
            onNavigate?.(categoryUninterceptedPath);
        } // if
    });
    
    
    
    // default props:
    const {
        // states:
        active     = (selectedModel?.id === id),
        
        
        
        // other props:
        ...restListItemProps
    } = restCategoryCardProps;
    
    
    
    // jsx:
    return (<>
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={articleRef}
            
            
            
            // behaviors:
            actionCtrl={true}
            
            
            
            // classes:
            className={styleSheet.main}
            
            
            
            // states:
            active={active}
            
            
            
            // handlers:
            href    = {categoryInterceptedPath} // shows the physical_link as (normal) intercepted category path for presentation reason
            onClick = {handleNavigate}          // but when clicked => navigate to subcategory -or- goto unintercepted category page
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
            
            { hasSubcategories && <Icon icon='dropright' size='xl' theme='primary' mild={active} className='arrow' />}
        </ListItem>
        
        { hasSubcategories && <PrefetchCategoryPage
            // refs:
            subjectRef={articleRef}
            
            
            
            // data:
            model={model}
            
            
            
            // states:
            initialPageNum={0} // the NEXT subcategories is always having PAGINATION with initial page num = 0, because it NEVER visited before
        />}
        
        {!hasSubcategories && <>
            <PrefetchCategoryDetail
                // refs:
                subjectRef={articleRef}
                
                
                
                // data:
                categoryPath={hierarchyPaths}
            />
            
            <PrefetchProductPage
                // refs:
                subjectRef={articleRef}
                
                
                
                // data:
                categoryPath={hierarchyPaths}
                
                
                
                // states:
                initialPageNum={0} // the products in productPage is always having PAGINATION with initial page num = 0
                initialPerPage={defaultProductPerPage}
            />
        </>}
    </>);
};
export {
    CategoryCard,
    CategoryCard as default,
}
