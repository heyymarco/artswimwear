import {
    State,
    City,
}                           from 'country-state-city'



// utilities:
export const getNormalizedStateName = (countryCode : string, stateName: string): string|null => {
    const stateLowercase = stateName.trim().toLowerCase();
    return (
        State.getStatesOfCountry(countryCode)
        .find(({name}) => (name.toLowerCase() === stateLowercase))
        ?.name
        
        ??
        
        stateName
    );
}
export const getNormalizedCityName = (countryCode : string, stateName: string, cityName: string): string|null => {
    const stateLowercase = stateName.trim().toLowerCase();
    const stateCode      = (
        State.getStatesOfCountry(countryCode)
        .find(({name}) => (name.toLowerCase() === stateLowercase))
        ?.isoCode
    );
    if (!stateCode) return cityName;
    
    
    
    const cityLowercase  = cityName.trim().toLowerCase();
    return (
        City.getCitiesOfState(countryCode, stateCode)
        .find(({name}) => (name.toLowerCase() === cityLowercase))
        ?.name
        
        ??
        
        cityName
    );
}