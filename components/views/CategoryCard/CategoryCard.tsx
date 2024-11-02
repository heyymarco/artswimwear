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
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

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
import {
    PrefetchKind,
    PrefetchRouter,
}                           from '@/components/prefetches/PrefetchRouter'

// models:
import {
    // types:
    type CategoryPreview,
    
    
    
    // defaults:
    defaultProductPerPage,
    defaultSubCategoryPerPage,
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
    const viewRef = useRef<HTMLDivElement|null>(null);
    
    
    
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
            elmRef={viewRef}
            
            
            
            // behaviors:
            actionCtrl={true}
            
            
            
            // classes:
            className={styleSheet.main}
            
            
            
            // states:
            active={active}
            
            
            
            // handlers:
            // href    = {categoryInterceptedPath} // shows the physical_link as (normal) intercepted category path for presentation reason
            onClick = {handleNavigate}          // but when clicked => navigate to subcategory -or- goto unintercepted category page
        >
            <Link
                // data:
                href={categoryInterceptedPath}  // shows the physical_link as (normal) intercepted category path for presentation reason
                
                
                
                // behaviors:
                /*
                    next-js BUG:
                    Assigning `prefetch={true}` causes the homepage shown when navigating intercepted `/categories`
                */
                // prefetch={true} // force to DEEP prefetch of category PAGE
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
            </Link>
        </ListItem>
        
        { hasSubcategories && <>
            {/* PREFETCH for displaying the NEXT sub category: */}
            <PrefetchCategoryPage
                // refs:
                subjectRef={viewRef}
                
                
                
                // data:
                model={model}
                
                
                
                // states:
                initialPageNum={0} // the NEXT subcategories is always having PAGINATION with initial page num = 0, because it NEVER visited before
                initialPerPage={defaultSubCategoryPerPage}
            />
        </>}
        
        {!hasSubcategories && <>
            {/* PREFETCH for displaying category PAGE: */}
            <PrefetchCategoryDetail
                // refs:
                subjectRef={viewRef}
                
                
                
                // data:
                categoryPath={hierarchyPaths}
            />
            
            {/* PREFETCH for displaying related PRODUCTS in category page: */}
            <PrefetchProductPage
                // refs:
                subjectRef={viewRef}
                
                
                
                // data:
                categoryPath={hierarchyPaths}
                
                
                
                // states:
                initialPageNum={0} // the products in productPage is always having PAGINATION with initial page num = 0
                initialPerPage={defaultProductPerPage}
            />
            
            {/* PREFETCH for displaying intercepted category PAGE: */}
            <PrefetchRouter
                // refs:
                subjectRef={viewRef}
                
                
                
                // data:
                href={categoryInterceptedPath}
                prefetchKind={PrefetchKind.FULL}
            />
            
            {/* PREFETCH for displaying unintercepted category PAGE: */}
            <PrefetchRouter
                // refs:
                subjectRef={viewRef}
                
                
                
                // data:
                href={categoryUninterceptedPath}
                prefetchKind={PrefetchKind.FULL}
            />
        </>}
    </>);
};
export {
    CategoryCard,
    CategoryCard as default,
}
