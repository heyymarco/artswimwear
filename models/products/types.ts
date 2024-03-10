// models:
import type {
    ProductVariant,
    ProductVariantGroup,
    Product,
    Stock,
}                           from '@prisma/client'



// types:
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
    image: Required<Product>['images'][number]|undefined
}

export interface ProductVariantDetail
    extends
    Pick<ProductVariant,
            |'id'
            
            |'name'
            
            |'price'
            |'shippingWeight'
            
            |'images'
        >
{
}
export interface ProductVariantGroupDetail
    extends
        Pick<ProductVariantGroup,
            |'name'
        >
{
    productVariants : ProductVariantDetail[]
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
    productVariantGroups : ProductVariantGroupDetail[]
}
