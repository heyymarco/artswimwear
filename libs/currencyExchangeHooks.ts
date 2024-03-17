'use client'

// react:
import {
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
    convertCustomerCurrencyIfRequired,
}                           from './currencyExchanges'
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'



// hooks:
export const useConvertCustomerCurrencyIfRequired = <TNumber extends number|null|undefined>(amount: TNumber): TNumber|undefined => {
    // states:
    const {
        // accessibilities:
        preferredCurrency,
    } = useCartState();
    
    
    
    const [convertedAmount, setConvertedAmount] = useState<TNumber|undefined>(undefined);
    const isMounted = useMountedFlag();
    useEffect(() => {
        // conditions:
        if (typeof(amount) !== 'number') {
            setConvertedAmount(amount); // undefined|null => nothing to convert
            return;
        } // if
        
        
        
        // actions:
        (async () => {
            const convertedAmount = await convertCustomerCurrencyIfRequired(
                amount,
                preferredCurrency
            );
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setConvertedAmount(convertedAmount);
        })();
    }, [amount, preferredCurrency]);
    
    
    
    return convertedAmount;
}
