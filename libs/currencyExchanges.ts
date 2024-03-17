// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'

// configs:
import {
    commerceConfig,
}                           from '@/commerce.config'
import {
    paymentConfig,
}                           from '@/payment.config'



// utilities:
const currencyExchange = {
    expires : new Date(),
    rates   : new Map<string, number>(),
};
/**
 * Gets the conversion ratio  
 * from app's default currency to `targetCurrency`.
 */
const getCurrencyRate      = async (targetCurrency: string): Promise<number> => {
    if (currencyExchange.expires <= new Date()) {
        const rates = currencyExchange.rates;
        rates.clear();
        
        //#region fetch https://www.exchangerate-api.com
        const exchangeRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATEAPI_KEY}/latest/${commerceConfig.defaultCurrency}`);
        if (exchangeRateResponse.status !== 200) throw Error('api error');
        const data = await exchangeRateResponse.json();
        const apiRates = data?.conversion_rates;
        if (typeof(apiRates) !== 'object') throw Error('api error');
        for (const currency in apiRates) {
            rates.set(currency, apiRates[currency]);
        } // for
        //#endregion fetch https://www.exchangerate-api.com
        
        currencyExchange.expires = new Date(Date.now() + (1 * 3600 * 1000));
    } // if
    
    
    
    const toRate = currencyExchange.rates.get(targetCurrency);
    if (toRate === undefined) throw Error('unknown currency');
    return 1 / toRate;
}

/**
 * Gets the conversion ratio (and fraction unit)
 * from user's preferred currency  
 * to the **most suitable currency** (no conversion if possible) that paypal's supports.
 */
const getCurrencyConverter = async (targetCurrency: string): Promise<{rate: number, fractionUnit: number}> => {
    return {
        rate         : await getCurrencyRate(targetCurrency),
        fractionUnit : commerceConfig.currencies[targetCurrency].fractionUnit,
    };
}



// exchangers:
/**
 * Converts:  
 * from app's default currency  
 * to the customer's preferred currency.
 */
export const convertCustomerCurrencyIfRequired = async <TNumber extends number|null|undefined>(fromAmount: TNumber, customerCurrency: string): Promise<TNumber> => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount;
    
    
    
    const {rate, fractionUnit} = await getCurrencyConverter(customerCurrency);
    const rawConverted         = fromAmount / rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[paymentConfig.currencyConversionRounding];
    const fractions            = rounding(rawConverted / fractionUnit);
    const stepped              = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}
/**
 * Reverts back:  
 * to app's default currency  
 * from the customer's preferred currency.
 */
export const revertCustomerCurrencyIfRequired  = async <TNumber extends number|null|undefined>(fromAmount: TNumber, customerCurrency: string): Promise<TNumber> => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount;
    
    
    
    const {rate}       = await getCurrencyConverter(customerCurrency);
    const fractionUnit = commerceConfig.currencies[commerceConfig.defaultCurrency].fractionUnit;
    const rawReverted  = fromAmount * rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[commerceConfig.currencyConversionRounding];
    const fractions    = rounding(rawReverted / fractionUnit);
    const stepped      = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}

/**
 * Converts:  
 * from user's preferred currency  
 * to the **most suitable currency** (no conversion if possible) that paypal's supports.
 */
export const convertPaypalCurrencyIfRequired   = async <TNumber extends number|null|undefined>(fromAmount: TNumber, paypalCurrency: string = paymentConfig.paymentProcessors.paypal.defaultCurrency): Promise<TNumber> => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount;
    
    
    
    const {rate, fractionUnit} = await getCurrencyConverter(paypalCurrency);
    const rawConverted         = fromAmount / rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[paymentConfig.currencyConversionRounding];
    const fractions            = rounding(rawConverted / fractionUnit);
    const stepped              = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}
/**
 * Reverts back:  
 * to user's preferred currency  
 * from the **most suitable currency** (no conversion if possible) that paypal's supports.
 */
export const revertPaypalCurrencyIfRequired    = async <TNumber extends number|null|undefined>(fromAmount: TNumber, paypalCurrency: string = paymentConfig.paymentProcessors.paypal.defaultCurrency): Promise<TNumber> => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount;
    
    
    
    const {rate}       = await getCurrencyConverter(paypalCurrency);
    const fractionUnit = commerceConfig.currencies[commerceConfig.defaultCurrency].fractionUnit;
    const rawReverted  = fromAmount * rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[commerceConfig.currencyConversionRounding];
    const fractions    = rounding(rawReverted / fractionUnit);
    const stepped      = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}
