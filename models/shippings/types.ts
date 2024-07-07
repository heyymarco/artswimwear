// models:
import {
    type ShippingProvider,
    type CoverageCountry,
    type CoverageState,
    type CoverageCity,
    type ShippingRate,
}                           from '@prisma/client'



// types:
export interface ShippingPreview
    extends
        Pick<ShippingProvider,
            // records:
            |'id'
            
            // data:
            |'name'
        >
{
}

export interface ShippingDetail
    extends
        Omit<ShippingProvider,
            // records:
            |'createdAt'
            |'updatedAt'
        >
{
    // relations:
    zones : CoverageCountryDetail[]
}

export interface CoverageCountryDetail
    extends
        Omit<CoverageCountry,
            // relations:
            |'parentId'
        >
{
    // relations:
    zones : CoverageStateDetail[]
}
export interface CoverageStateDetail
    extends
        Omit<CoverageState,
            // relations:
            |'parentId'
        >
{
    // relations:
    zones : CoverageCityDetail[] 
}
export interface CoverageCityDetail
    extends
        Omit<CoverageCity,
            // data:
            |'updatedAt' // changed to optional for the `EditCoverageZoneDialog`
            
            // relations:
            |'parentId'
        >,
        Partial<Pick<CoverageCity,
            // data:
            |'updatedAt' // changed to optional for the `EditCoverageZoneDialog`
        >>
{
}



export interface ShippingRateWithId extends ShippingRate {
    // records:
    id : string
}



export interface CoverageZoneDetail<TSubzone extends CoverageSubzone>
    extends
        Omit<CoverageCountryDetail,
            // data:
            |'useZones' // generic-ify the sub-zones
            |'zones'    // generic-ify the sub-zones
        >,
        Omit<CoverageStateDetail,
            // data:
            |'useZones' // generic-ify the sub-zones
            |'zones'    // generic-ify the sub-zones
        >,
        Omit<CoverageCityDetail,
            // data:
            |'useZones' // generic-ify the sub-zones
            |'zones'    // generic-ify the sub-zones
        >
{
    // data:
    useZones : TSubzone extends never ? never : boolean    // generic-ify the sub-zones
    zones    : TSubzone extends never ? never : TSubzone[] // generic-ify the sub-zones
}

export type CoverageSubzone = CoverageStateDetail|CoverageCityDetail|never
