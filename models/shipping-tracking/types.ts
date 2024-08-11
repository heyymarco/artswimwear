// models:
import {
    type ShippingTracking,
    type ShippingTrackingEta,
    type ShippingTrackingLog,
}                           from '@prisma/client'



export interface ShippingTrackingPreview
    extends
        Pick<ShippingTracking,
            |'shippingCarrier'
            |'shippingNumber'
        >
{
    shippingEta : Pick<ShippingTrackingEta,
        |'min'
        |'max'
    >|null
}



export interface ShippingTrackingRequest {
    shippingTracking : Partial<Pick<ShippingTrackingDetail, 'preferredTimezone'>> & {
        token : string
    }
}
export interface ShippingTrackingDetail
    extends
        Pick<ShippingTracking,
            |'shippingCarrier'
            |'shippingNumber'
        >
{
    preferredTimezone    : number
    shippingTrackingLogs : Omit<ShippingTrackingLog, 'id'|'shippingTrackingId'>[]
}