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
    convertAndSumAmount,
}                           from '@/libs/currencyExchanges'



// react components:
export interface CurrencyDisplayProps {
    currency     ?: string
    currencyRate ?: number
    amount        : number|null|undefined | Array<ProductPricePart|number|null|undefined>
    multiply     ?: number
}
const CurrencyDisplay = (props: CurrencyDisplayProps): JSX.Element|null => {
    // states:
    const {
        // accessibilities:
        currency : cartCurrency,
    } = useCartState();
    const [convertedAmount, setConvertedAmount] = useState<number|null|undefined>(undefined);
    
    
    
    // props:
    const {
        currency     = cartCurrency,
        currencyRate = undefined,
        amount       : amountRaw,
        multiply     = 1,
    } = props;
    
    
    
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
            const summedAmount = await convertAndSumAmount(amountList, currency, currencyRate);
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
