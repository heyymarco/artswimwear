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
const amountReducer = (accum: number|null|undefined, current: number|null|undefined): number|null|undefined => {
    if (typeof(current) !== 'number') return accum;   // ignore null
    if (typeof(accum)   !== 'number') return current; // ignore null
    return (accum + current);
};



// react components:
export interface CurrencyDisplayProps {
    amount : number|null|undefined | Array<number|null|undefined>
}
const CurrencyDisplay = ({amount: amountRaw}: CurrencyDisplayProps): JSX.Element|null => {
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
        : amountRaw.reduce(amountReducer, undefined)
    );
    useEffect(() => {
        // conditions:
        if (typeof(amount) !== 'number') {
            setConvertedAmount(amount); // undefined|null => nothing to convert
            return;
        } // if
        
        
        
        // actions:
        (async () => {
            const convertedAmount = await convertCustomerCurrencyIfRequired(amount, preferredCurrency);
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setConvertedAmount(convertedAmount);
        })();
    }, [amount, preferredCurrency]);
    
    
    
    // jsx:
    return (
        <>
            {formatCurrency(convertedAmount, preferredCurrency)}
        </>
    );
};
export {
    CurrencyDisplay,
    CurrencyDisplay as default,
};
