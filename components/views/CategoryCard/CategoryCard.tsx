'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
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

// models:
import {
    type CategoryPreview,
}                           from '@/models'

// stores:
import {
    // hooks:
    usePrefetchCategoryDetail,
}                           from '@/store/features/api/apiSlice'



// defaults:
// const maxGalleryItemWidth = 534; // 534px = (255*2) + (16 * 1.5) = 534
const minImageWidth = 44;  // 44px === (50px + (2* paddingBlock)) * aspectRatio === (50px + (2* 8px)) * 2/3



// react components:
export interface CategoryCardProps extends ModelPreviewProps<CategoryPreview> {
    // values:
    selectedModel ?: CategoryPreview|null
    onModelSelect ?: EditorChangeEventHandler<CategoryPreview>
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
    const hierarchyPaths : string[] = [
        ...parentCategories.map(({category: {path}}) => path),
        path,
    ];
    const categoryBasePath          = hierarchyPaths.join('/');
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
        
        {!hasSubcategories && <PrefetchCategoryDetail
            // refs:
            articleRef={articleRef}
            
            
            
            // data:
            path={hierarchyPaths.join('/')}
        />}
    </>);
};
export {
    CategoryCard,
    CategoryCard as default,
}



interface PrefetchCategoryDetailProps {
    // refs:
    articleRef : React.RefObject<HTMLDivElement|null>
    
    
    
    // data:
    path       : string
}
const PrefetchCategoryDetail = (props: PrefetchCategoryDetailProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        articleRef,
        
        
        
        // data:
        path,
    } = props;
    
    
    
    // apis:
    const prefetchCategoryDetail = usePrefetchCategoryDetail();
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        const articleElm = articleRef.current;
        if (!articleElm) return;
        
        
        
        // setups:
        const observer = new IntersectionObserver((entries) => {
            // conditions:
            if (!entries[0]?.isIntersecting) return;
            
            
            
            // actions:
            observer.disconnect(); // the observer is no longer needed anymore
            prefetchCategoryDetail(path.split('/'));
        }, {
            root      : null, // defaults to the browser viewport
            threshold : 0.5,
        });
        observer.observe(articleElm);
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, [path]);
    
    
    
    // jsx:
    return null;
};
