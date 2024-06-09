// models:
import {
    type ShippingProvider,
}                           from '@prisma/client'



// types:
export interface ShippingPreview
    extends
        Pick<ShippingProvider,
            |'id'
            |'name'
        >
{
}

export interface ShippingDetail
    extends
        Omit<ShippingProvider,
            |'createdAt'
            |'updatedAt'
        >
{
}
