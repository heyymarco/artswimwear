// models:
import {
    type Shipment,
    type ShipmentEta,
    type ShipmentLog,
}                           from '@prisma/client'



export interface ShipmentPreview
    extends
        Pick<Shipment,
            |'carrier'
            |'number'
        >
{
    eta : Pick<ShipmentEta,
        |'min'
        |'max'
    >|null
}



export interface ShipmentRequest {
    shipment : Partial<Pick<ShipmentDetail, 'preferredTimezone'>> & {
        token : string
    }
}
export interface ShipmentDetail
    extends
        Pick<Shipment,
            |'carrier'
            |'number'
        >
{
    preferredTimezone : number
    logs              : Omit<ShipmentLog, 'id'|'parentId'>[]
}