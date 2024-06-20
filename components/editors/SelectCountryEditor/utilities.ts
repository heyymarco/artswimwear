// privates:
import {
    default as defaultCountryMap
}                           from './defaultCountryMap'



export const getCountryByCode  = (countryCode: string|null|undefined): string|null => (countryCode ? defaultCountryMap.get(countryCode) : null) ?? null;
export const getCountryDisplay = (countryCode: string|null|undefined): string => (countryCode ? getCountryByCode(countryCode.trim().toUpperCase()) : null) ?? '';
export const countryList       = Array.from(defaultCountryMap.keys());
