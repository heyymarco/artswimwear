// models:
import {
    type ShippingProvider,
    type CoverageCountry,
    type CoverageState,
    type CoverageCity,
    type ShippingOrigin,
    type ShippingProviderEta,
    type CoverageCountryEta,
    type CoverageStateEta,
    type CoverageCityEta,
    type ShippingProviderRate,
    type CoverageCountryRate,
    type CoverageStateRate,
    type CoverageCityRate,
    
    type Country,
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
    // data:
    origin : ShippingOriginDetail|null
    
    eta    : ShippingEta|null
    rates  : ShippingRate[]
    
    
    
    // relations:
    zones  : CoverageCountryDetail[]
}



export interface ShippingOriginDetail
    extends
        Omit<ShippingOrigin,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}



export interface CoverageCountryDetail
    extends
        Omit<CoverageCountry,
            // relations:
            |'parentId'
        >
{
    // data:
    eta    : ShippingEta|null
    rates  : ShippingRate[]
    
    
    
    // relations:
    zones  : CoverageStateDetail[]
}
export interface CoverageStateDetail
    extends
        Omit<CoverageState,
            // relations:
            |'parentId'
        >
{
    // data:
    eta    : ShippingEta|null
    rates  : ShippingRate[]
    
    
    
    // relations:
    zones  : CoverageCityDetail[] 
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
    // data:
    eta    : ShippingEta|null
    rates  : ShippingRate[]
}



export interface ShippingEta
    extends
        Omit<ShippingProviderEta,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >,
        Omit<CoverageCountryEta,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >,
        Omit<CoverageStateEta,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >,
        Omit<CoverageCityEta,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}



export interface ShippingRate
    extends
        Omit<ShippingProviderRate,
            // records:
            |'id'
            
            // data:
            |'sort'
            
            // relations:
            |'parentId'
        >,
        Omit<CoverageCountryRate,
            // records:
            |'id'
            
            // data:
            |'sort'
            
            // relations:
            |'parentId'
        >,
        Omit<CoverageStateRate,
            // records:
            |'id'
            
            // data:
            |'sort'
            
            // relations:
            |'parentId'
        >,
        Omit<CoverageCityRate,
            // records:
            |'id'
            
            // data:
            |'sort'
            
            // relations:
            |'parentId'
        >
{
}
export interface ShippingRateWithId
    extends
        ShippingRate
{
    // records:
    /**
     * A temporary id on client side.
     */
    id : string
}



export interface CoverageZoneDetail<TSubzone extends CoverageSubzoneDetail>
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

export type CoverageSubzoneDetail = CoverageStateDetail|CoverageCityDetail|never



export interface CountryPreview
    extends
        Pick<Country,
            |'name'
            |'code'
        >
{
}
