'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type PaginationListProps,
}                           from '@/components/explorers/PaginationList'
import {
    type PaginationGalleryProps,
}                           from '@/components/explorers/PaginationGallery'
import {
    type CategoryViewProps,
    CategoryView,
}                           from '@/components/views/CategoryView'

// models:
import {
    // types:
    type CategoryPreview,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetCategoryPage as _useGetCategoryPage,
}                           from '@/store/features/api/apiSlice'



// react components:
type PaginationListGalleryProps = Pick<PaginationListProps<CategoryPreview> & PaginationGalleryProps<CategoryPreview>,
    Extract<keyof PaginationListProps<CategoryPreview>, keyof PaginationGalleryProps<CategoryPreview>>
>
export interface CategoryExplorerBaseProps
    extends
        // bases:
        Omit<PaginationListGalleryProps,
            // accessibilities:
            |'createItemText'
            
            // components:
            |'modelCreateComponent'
            |'modelPreviewComponent'
            |'moreButtonComponent'
            
            // handlers:
            |'onModelCreate'
        >,
        Partial<Pick<PaginationListGalleryProps,
            |'modelPreviewComponent'
        >>
{
    // components:
    paginationBaseComponent : React.ReactComponentElement<any, (PaginationListProps<CategoryPreview> | PaginationGalleryProps<CategoryPreview>)>
}
const CategoryExplorerBase = (props: CategoryExplorerBaseProps): JSX.Element|null => {
    // props:
    const {
        // components:
        paginationBaseComponent,
        
        
        
        // other props:
        ...restCategoryExplorerBaseProps
    } = props;
    
    
    
    // default props:
    const {
        // appearances:
        showPaginationTop     = false,
        autoHidePagination    = true,
        
        
        
        // accessibilities:
        textEmpty             = 'Collection is empty',
        
        
        
        // components:
        bodyComponent         = (<Basic nude={true} theme='inherit' mild='inherit' /> as React.ReactComponentElement<any, BasicProps<Element>>),
        modelPreviewComponent = (<CategoryView
            // data:
            model={undefined as any}
        />                                                                            as React.ReactComponentElement<any, CategoryViewProps>),
        
        
        
        // other props:
        ...restPaginationBaseProps
    } = restCategoryExplorerBaseProps;
    
    
    
    // jsx:
    return (
        React.cloneElement<(PaginationListProps<CategoryPreview> | PaginationGalleryProps<CategoryPreview>)>(paginationBaseComponent,
            // props:
            {
                // other props:
                ...restPaginationBaseProps,
                
                
                
                // appearances:
                showPaginationTop,
                autoHidePagination,
                
                
                
                // accessibilities:
                textEmpty,
                
                
                
                // components:
                bodyComponent,
                modelPreviewComponent,
            },
        )
    );
};
export {
    CategoryExplorerBase,
    CategoryExplorerBase as default,
}
