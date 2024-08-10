// models:
import {
    type ShippingTracking,
    type ShippingTrackingLog,
}                           from '@prisma/client'



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