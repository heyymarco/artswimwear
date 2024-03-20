// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'

// stores:
import type {
    ProductPricePart,
}                           from '@/store/features/api/apiSlice'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'



// utilities:
const sumReducer = <TNumber extends number|null|undefined>(accum: TNumber, value: TNumber): TNumber => {
    if (typeof(value) !== 'number') return accum; // ignore null
    if (typeof(accum) !== 'number') return value; // ignore null
    return (accum + value) as TNumber;
};



// react components:
export interface CurrencyDisplayProps {
    amount    : number|null|undefined | Array<ProductPricePart|number|null|undefined>
    multiply ?: number
}
const CurrencyDisplay = (props: CurrencyDisplayProps): JSX.Element|null => {
    // props:
    const {
        amount   : amountRaw,
        multiply = 1,
    } = props;
    
    
    
    // contexts:
    const {
        // data:
        order : {
            preferredCurrency,
        },
    } = useOrderDataContext();
    
    
    
    // calcs:
    const amountList = (
        !Array.isArray(amountRaw)
        ? [amountRaw]
        : amountRaw
    );
    
    
    
    // no need to convert. The saved amount is already in customer's preference currency
    // const convertedAmount = (
    //     (await Promise.all(
    //         amountList
    //         .flatMap((amountItem): number|null|undefined | Promise<number|null|undefined> => {
    //             if (amountItem && typeof(amountItem) === 'object') {
    //                 const {
    //                     priceParts,
    //                     quantity,
    //                 } = amountItem;
    //                 
    //                 return (
    //                     Promise.all(
    //                         priceParts
    //                         .map((pricePart): number | Promise<number> =>
    //                             !!preferredCurrency
    //                             ? convertCustomerCurrencyIfRequired(pricePart, preferredCurrency)
    //                             : pricePart
    //                         )
    //                     )
    //                     .then((priceParts): number =>
    //                         priceParts
    //                         .reduce(sumReducer, 0) // may produces ugly_fractional_decimal
    //                         *
    //                         quantity               // may produces ugly_fractional_decimal
    //                     )
    //                 );
    //             } else {
    //                 return (
    //                     !!preferredCurrency
    //                     ? convertCustomerCurrencyIfRequired(amountItem, preferredCurrency)
    //                     : amountItem
    //                 );
    //             } // if
    //         })
    //     ))
    //     .reduce(sumReducer, undefined)             // may produces ugly_fractional_decimal
    // );
    
    
    
    const mergedAmount = (
        amountList
        .flatMap((amountItem): number|null|undefined => {
            if (amountItem && typeof(amountItem) === 'object') {
                const {
                    priceParts,
                    quantity,
                } = amountItem;
                
                return (
                    priceParts
                    .reduce(sumReducer, 0) // may produces ugly_fractional_decimal
                    *
                    quantity               // may produces ugly_fractional_decimal
                );
            } else {
                return amountItem;
            } // if
        })
        .reduce(sumReducer, undefined)     // may produces ugly_fractional_decimal
    );
    
    
    
    // jsx:
    return (
        <>
            {formatCurrency(
                (typeof(mergedAmount) === 'number')
                ? (mergedAmount * multiply)     // may produces ugly_fractional_decimal
                : mergedAmount                  // no need to decimalize accumulated numbers to avoid producing ugly_fractional_decimal // `formatCurrency()` wouldn't produce ugly_fractional_decimal
            , preferredCurrency?.currency)}
        </>
    );
};
export {
    CurrencyDisplay,
    CurrencyDisplay as default,
};
