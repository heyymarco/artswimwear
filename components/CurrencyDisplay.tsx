'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// stores:
import type {
    ProductPricePart,
}                           from '@/store/features/api/apiSlice'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    convertCustomerCurrencyIfRequired,
}                           from '@/libs/currencyExchanges'



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
    
    
    
    // states:
    const {
        // accessibilities:
        currency,
    } = useCartState();
    const [convertedAmount, setConvertedAmount] = useState<number|null|undefined>(undefined);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    useEffect(() => {
        // conditions:
        const amountList = (
            !Array.isArray(amountRaw)
            ? [amountRaw]
            : amountRaw
        );
        if (!amountList.length) { // empty => nothing to convert
            setConvertedAmount(undefined);
            return;
        } // if
        
        
        
        // actions:
        (async () => {
            /*
                ConvertCurrency *each* item first, then sum them all.
                Do not sum first, to avoid precision error.
            */
            const summedAmount = (
                (await Promise.all(
                    amountList
                    .flatMap((amountItem): Promise<number|null|undefined> => {
                        if (amountItem && typeof(amountItem) === 'object') {
                            const {
                                priceParts,
                                quantity,
                            } = amountItem;
                            
                            return (
                                Promise.all(
                                    priceParts
                                    .map((pricePart): Promise<number> =>
                                        convertCustomerCurrencyIfRequired(pricePart, currency)
                                    )
                                )
                                .then((priceParts): number =>
                                    priceParts
                                    .reduce(sumReducer, 0) // may produces ugly_fractional_decimal
                                    *
                                    quantity               // may produces ugly_fractional_decimal
                                )
                            );
                        } else {
                            return convertCustomerCurrencyIfRequired(amountItem, currency);
                        } // if
                    })
                ))
                .reduce(sumReducer, undefined)             // may produces ugly_fractional_decimal
            );
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setConvertedAmount(summedAmount);
        })();
    }, [amountRaw, currency]);
    
    
    
    // jsx:
    return (
        <>
            {formatCurrency(
                (typeof(convertedAmount) === 'number')
                ? (convertedAmount * multiply)             // may produces ugly_fractional_decimal
                : convertedAmount                          // no need to decimalize accumulated numbers to avoid producing ugly_fractional_decimal // `formatCurrency()` wouldn't produce ugly_fractional_decimal
            , currency)}
        </>
    );
};
export {
    CurrencyDisplay,
    CurrencyDisplay as default,
};
