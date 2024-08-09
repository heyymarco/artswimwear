// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'
import {
    sumReducer,
}                           from '@/libs/numbers'

// models:
import {
    type ProductPricePart,
    type OrderCurrencyDetail,
}                           from '@/models'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// utilities:
const currencyExchange = {
    expires : new Date(),
    rates   : new Map<string, number>(),
};
let currencyExchangeUpdatedPromise : Promise<void>|undefined = undefined;
/**
 * Gets the conversion ratio  
 * from app's default currency to `targetCurrency`.
 */
export const getCurrencyRate = async (targetCurrency: string): Promise<number> => {
    if (currencyExchange.expires <= new Date()) {
        if (!currencyExchangeUpdatedPromise) currencyExchangeUpdatedPromise = (async (): Promise<void> => {
            const rates = currencyExchange.rates;
            rates.clear();
            
            
            
            const exchangeRateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/currency-exchange`, {
                cache : 'force-cache',
                // next  : { // "cache: force-cache" and "revalidate: 86400", only one should be specified
                //     revalidate : 1 * 24 * 3600, // set the cache lifetime of a resource (in seconds).
                // },
            });
            if (exchangeRateResponse.status !== 200) throw Error('api error');
            const apiRates = await exchangeRateResponse.json();
            if (typeof(apiRates) !== 'object') throw Error('api error');
            for (const currency in apiRates) {
                rates.set(currency, apiRates[currency]);
            } // for
            
            
            
            currencyExchange.expires = new Date(Date.now() + (1 * 24 * 3600 * 1000));
        })();
        await currencyExchangeUpdatedPromise;
        currencyExchangeUpdatedPromise = undefined;
    } // if
    
    
    
    const toRate = currencyExchange.rates.get(targetCurrency);
    if (toRate === undefined) throw Error('unknown currency');
    return toRate;
}

/**
 * Gets the conversion ratio (and fraction unit)
 * from app's default currency to `targetCurrency`.
 */
const getCurrencyConverter   = async (targetCurrency: string): Promise<{rate: number, fractionUnit: number}> => {
    return {
        rate         : await getCurrencyRate(targetCurrency),
        fractionUnit : checkoutConfigShared.intl.currencies[targetCurrency]?.fractionUnit ?? 0.001,
    };
}



// exchangers:
/**
 * Converts:  
 * from app's default currency  
 * to the customer's preferred currency.
 */
export const convertCustomerCurrencyIfRequired = async <TNumber extends number|null|undefined>(fromAmount: TNumber, customerCurrency: string|OrderCurrencyDetail): Promise<TNumber> => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount;                     // null|undefined    => nothing to convert
    if (customerCurrency === checkoutConfigShared.intl.defaultCurrency) return fromAmount; // the same currency => nothing to convert
    
    
    
    const {rate, fractionUnit} = (
        (typeof(customerCurrency) === 'string')
        ? await getCurrencyConverter(customerCurrency)
        : {
            rate         : customerCurrency.rate,
            fractionUnit : checkoutConfigShared.intl.currencies[customerCurrency.currency]?.fractionUnit ?? 0.001,
        }
    );
    const rawConverted         = fromAmount * rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[checkoutConfigShared.intl.currencyConversionRounding]; // reverts using app's currencyConversionRounding (usually ROUND)
    const fractions            = rounding(rawConverted / fractionUnit);
    const stepped              = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}



export const convertForeignToSystemCurrencyIfRequired = async <TNumber extends number|null|undefined>(fromAmount: TNumber, foreignCurrency: string): Promise<TNumber> => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount;                     // null|undefined    => nothing to convert
    if (foreignCurrency === checkoutConfigShared.intl.defaultCurrency) return fromAmount; // the same currency => nothing to convert
    
    
    
    const fractionUnit = checkoutConfigShared.intl.currencies[checkoutConfigShared.intl.defaultCurrency]?.fractionUnit ?? 0.001;
    const {rate} = await getCurrencyConverter(foreignCurrency);
    const rawConverted = fromAmount / rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[checkoutConfigShared.intl.currencyConversionRounding]; // reverts using app's currencyConversionRounding (usually ROUND)
    const fractions    = rounding(rawConverted / fractionUnit);
    const stepped      = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}



export const convertAndSumAmount = async (amount: number|null|undefined | Array<ProductPricePart|number|null|undefined>, customerCurrency: string|OrderCurrencyDetail): Promise<number|null|undefined> => {
    const amountList = (
        !Array.isArray(amount)
        ? [amount]
        : amount
    );
    if (!amountList.length) return undefined; // empty => nothing to convert
    
    
    
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
                                convertCustomerCurrencyIfRequired(pricePart, customerCurrency)
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
                    return convertCustomerCurrencyIfRequired(amountItem, customerCurrency);
                } // if
            })
        ))
        .reduce(sumReducer, undefined)             // may produces ugly_fractional_decimal
    );
    return summedAmount;
}
