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

// models:
import {
    // types:
    type ProductPricePart,
}                           from '@/models'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    sumReducer,
}                           from '@/libs/numbers'



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
            currency,
        },
    } = useOrderDataContext();
    
    
    
    // calcs:
    const amountList = (
        !Array.isArray(amountRaw)
        ? [amountRaw]
        : amountRaw
    );
    
    
    
    // no need to convert. The saved amount is already in customer's preference currency
    // const convertedAmount2 = await convertAndSumAmount(amountList, currency);
    
    
    
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
            , currency?.currency)}
        </>
    );
};
export {
    CurrencyDisplay,
    CurrencyDisplay as default,
};
