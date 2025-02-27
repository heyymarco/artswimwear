// models:
import {
    type Variant,
    type VariantGroup,
    
    type Product,
    
    type Wish,
    
    type Category,
}                           from '@prisma/client'
import {
    type Pagination,
    type PaginationArgs,
}                           from '../commons'



// types:
export interface VariantPreview
    extends
    Pick<Variant,
        |'id'
        
        |'name'
        
        |'price'
        |'shippingWeight'
    >
{
    image : Required<Variant>['images'][number]|undefined
}
export interface VariantDetail
    extends
        Pick<Variant,
            |'id'
            
            |'name'
            
            |'price'
            |'shippingWeight'
            
            |'images'
        >
{
}
export interface VariantGroupDetail
    extends
        Pick<VariantGroup,
            |'name'
        >
{
    variants : VariantDetail[]
}



export interface ProductPreview
    extends
        Pick<Product,
            |'id'
            |'name'
            |'price'
            |'shippingWeight'
            |'path'
        >
{
    image         : Required<Product>['images'][number]|undefined
    variantGroups : VariantPreview[][]
    
    // relations:
    /**
     * undefined : unwished  
     * null      : wished (ungrouped)  
     * string    : wished (grouped)  
     */
    wished        : Wish['groupId']|undefined
}
export interface ProductDetail
    extends
        Pick<Product,
            |'id'
            |'name'
            |'price'
            |'path'
            |'excerpt'
            |'description'
            |'keywords'
            |'images'
        >
{
    variantGroups : VariantGroupDetail[]
}



export interface GetProductPageRequest
    extends
        PaginationArgs
{
    categoryPath ?: string[]
}



export interface ProductPricePart {
    priceParts : number[],
    quantity   : number
}



export interface SearchProductsPageRequest
    extends
        PaginationArgs
{
    query : string
}



export interface CategoryPreview
    extends
        Pick<Category,
            |'id'
            |'name'
            |'path'
        >
{
    image            : Required<Category>['images'][number]|undefined
    hasSubcategories : boolean
}



export interface CategoryParentInfo {
    category : CategoryPreview
    index    : number
}
export interface CategoryDetail
    extends
        Pick<Category,
            |'id'
            |'name'
            |'path'
            |'excerpt'
            |'description'
            |'images'
        >
{
    hasSubcategories : boolean
    parents          : CategoryParentInfo[]
    index            : number
}



export interface CategoryPageRequest
    extends
        PaginationArgs
{
    parent : Category['parentId']
}

export interface CategoryPreviewPagination
    extends
        Pagination<CategoryPreview>
{
    has2ndLevelCategories ?: boolean
}
