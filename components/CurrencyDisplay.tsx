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

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    convertCustomerCurrencyIfRequired,
}                           from '@/libs/currencyExchanges'



// utilities:
const amountReducer = (accum: number|null|undefined, value: number|null|undefined): number|null|undefined => {
    if (typeof(value) !== 'number') return accum; // ignore null
    if (typeof(accum) !== 'number') return value; // ignore null
    return (accum + value);
};



// react components:
export interface CurrencyDisplayProps {
    amount    : number|null|undefined | Array<number|null|undefined>
    multiply ?: number
}
const CurrencyDisplay = ({amount: amountRaw, multiply = 1}: CurrencyDisplayProps): JSX.Element|null => {
    // states:
    const {
        // accessibilities:
        preferredCurrency,
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
                    .map((amountItem) =>
                        convertCustomerCurrencyIfRequired(amountItem, preferredCurrency)
                    )
                ))
                .reduce(amountReducer, undefined) // may produces ugly_fractional_decimal
            );
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setConvertedAmount(summedAmount);
        })();
    }, [amountRaw, preferredCurrency]);
    
    
    
    // jsx:
    return (
        <>
            {formatCurrency(
                (typeof(convertedAmount) === 'number')
                ? (convertedAmount * multiply) // may produces ugly_fractional_decimal
                : convertedAmount              // no need to decimalize accumulated numbers to avoid producing ugly_fractional_decimal // `formatCurrency()` wouldn't produce ugly_fractional_decimal
            , preferredCurrency)}
        </>
    );
};
export {
    CurrencyDisplay,
    CurrencyDisplay as default,
};
