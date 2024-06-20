// react:
import {
    // react:
    default as React,
}                           from 'react'

// privates:
import {
    getCountryByCode,
}                           from './utilities'



// react components:
export interface CountryDisplayProps
{
    // value:
    value : string|null|undefined
}
const CountryDisplay = (props: CountryDisplayProps): JSX.Element|null => {
    // default props:
    const {
        // values:
        value,
    } = props;
    
    
    
    // jsx:
    return (
        <>
            {getCountryByCode(value)}
        </>
    );
};
export {
    CountryDisplay,            // named export for readibility
    CountryDisplay as default, // default export to support React.lazy
}
