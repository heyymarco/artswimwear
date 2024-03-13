// models:
import type {
    Variant,
    VariantGroup,
    Product,
    Stock,
}                           from '@prisma/client'



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
            |'images'
        >
{
    variantGroups : VariantGroupDetail[]
}
