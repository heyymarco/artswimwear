// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'

// models:
import type {
    OrderCurrencyDetail,
}                           from '@/models'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'
import {
    paymentConfig,
}                           from '@/payment.config'



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
            
            
            
            const exchangeRateResponse = await fetch(`${process.env.APP_URL ?? ''}/api/currency-exchange`, {
                cache : 'force-cache',
                next  : {
                    revalidate : 1 * 24 * 3600, // set the cache lifetime of a resource (in seconds).
                },
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
 * from user's preferred currency  
 * to the **most suitable currency** (no conversion if possible) that paypal's supports.
 */
const getCurrencyConverter   = async (targetCurrency: string): Promise<{rate: number, fractionUnit: number}> => {
    return {
        rate         : await getCurrencyRate(targetCurrency),
        fractionUnit : checkoutConfigShared.intl.currencies[targetCurrency].fractionUnit,
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
            fractionUnit : checkoutConfigShared.intl.currencies[customerCurrency.currency].fractionUnit
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



/**
 * Converts:  
 * from user's preferred currency  
 * to the **most suitable currency** (no conversion if possible) that paypal's supports.
 */
export const convertPaypalCurrencyIfRequired   = async <TNumber extends number|null|undefined>(fromAmount: TNumber, sourceCurrency: string, paypalCurrency: string = paymentConfig.paymentProcessors.paypal.defaultCurrency): Promise<TNumber> => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount;                   // null|undefined    => nothing to convert
    if (paypalCurrency === checkoutConfigShared.intl.defaultCurrency) return fromAmount; // the same currency => nothing to convert
    
    
    
    const {rate: sourceRate  } = await getCurrencyConverter(sourceCurrency);
    const {rate, fractionUnit} = await getCurrencyConverter(paypalCurrency);
    const rawConverted         = fromAmount * rate / sourceRate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[paymentConfig.currencyConversionRounding]; // converts using app payment's currencyConversionRounding (usually FLOOR, to avoid customer complain)
    const fractions            = rounding(rawConverted / fractionUnit);
    const stepped              = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}



export const convertForeignToSystemCurrencyIfRequired = async <TNumber extends number|null|undefined>(fromAmount: TNumber, foreignCurrency: string): Promise<TNumber> => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount;                     // null|undefined    => nothing to convert
    if (foreignCurrency === checkoutConfigShared.intl.defaultCurrency) return fromAmount; // the same currency => nothing to convert
    
    
    
    const {rate, fractionUnit} = await getCurrencyConverter(foreignCurrency);
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
