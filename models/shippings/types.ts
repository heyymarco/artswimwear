// models:
import {
    type ShippingProvider,
    type CoverageCountry,
    type CoverageState,
    type CoverageCity,
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
            
            // data:
            |'zones' // we redefined the zones with less detail
        >
{
    // data:
    zones : CoverageCountryDetail[] // we redefined the zones with less detail
}

export interface CoverageCountryDetail
    extends
        Omit<CoverageCountry,
            // data:
            'zones' // we redefined the zones with less detail
        >
{
    // data:
    zones : CoverageStateDetail[] // we redefined the zones with less detail
}
export interface CoverageStateDetail
    extends
        Omit<CoverageState,
            // data:
            'zones' // we redefined the zones with less detail
        >
{
    // data:
    zones : CoverageCityDetail[] // we redefined the zones with less detail
}
export interface CoverageCityDetail
    extends
        Omit<CoverageCity,
            // data:
            |'updatedAt' // less detailed of `updatedAt` because we don't need it (and won't update it) for the `EditCoverageZoneDialog`
        >
{
}
