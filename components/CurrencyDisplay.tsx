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
    trimCustomerCurrencyIfRequired,
    convertCustomerCurrencyIfRequired,
}                           from '@/libs/currencyExchanges'



// utilities:
const amountReducer = (accum: number|null|undefined, current: number|null|undefined): number|null|undefined => {
    if (typeof(current) !== 'number') return accum;   // ignore null
    if (typeof(accum)   !== 'number') return current; // ignore null
    return (accum + current);
};



// react components:
export interface CurrencyDisplayProps {
    amount    : number|null|undefined | Array<number|null|undefined>
    multiply ?: number
    trim     ?: boolean
}
const CurrencyDisplay = ({amount: amountRaw, multiply = 1, trim = false}: CurrencyDisplayProps): JSX.Element|null => {
    // states:
    const {
        // accessibilities:
        preferredCurrency,
    } = useCartState();
    const [convertedAmount, setConvertedAmount] = useState<number|null|undefined>(undefined);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    const amount    = (
        !Array.isArray(amountRaw)
        ? amountRaw
        : amountRaw.reduce(amountReducer, undefined) // may produces ugly_fractional_decimal
    );
    useEffect(() => {
        // conditions:
        if (typeof(amount) !== 'number') {
            setConvertedAmount(amount); // undefined|null => nothing to convert
            return;
        } // if
        
        
        
        // actions:
        (async () => {
            const trimmedAmount   = trim ? await trimCustomerCurrencyIfRequired(amount, preferredCurrency) : amount;
            const convertedAmount = await convertCustomerCurrencyIfRequired(trimmedAmount, preferredCurrency);
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setConvertedAmount(convertedAmount);
        })();
    }, [amount, preferredCurrency, trim]);
    
    
    
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
