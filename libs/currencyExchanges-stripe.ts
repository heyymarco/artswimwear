// reusable-ui core:
import {
    decimalify,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// utilities:
const stripeZeroDecimalCurrencies = [
    'BIF',
    'CLP',
    'DJF',
    'GNF',
    'JPY',
    'KMF',
    'KRW',
    'MGA',
    'PYG',
    'RWF',
    'UGX',
    'VND',
    'VUV',
    'XAF',
    'XOF',
    'XPF',
];
const stripeThreeDecimalCurrencies = [
    'BHD',
    'JOD',
    'KWD',
    'OMR',
    'TND',
];
export const convertCurrencyToStripeNominal = (amount: number, currency: string): number => {
    currency = currency.toUpperCase();
    if (stripeZeroDecimalCurrencies.includes(currency)) {
        return decimalify(Math.ceil(amount));
    }
    else if (stripeThreeDecimalCurrencies.includes(currency)) {
        /*
            To ensure compatibility with Stripe’s payments partners, these API calls require the least-significant (last) digit to be 0.
            Your integration must round amounts to the nearest ten.
            For example, 5.124 KWD must be rounded to 5120 or 5130.
        */
        return decimalify(Math.ceil(amount * 100) * 10);
    }
    else {
        /*
            To charge 10 USD, provide an amount value of 1000 (that is, 1000 cents).
        */
        return decimalify(Math.ceil(amount * 100)); // convert to cents
    } // if
}
export const revertCurrencyFromStripeNominal = (amount: number, currency: string): number => {
    currency = currency.toUpperCase();
    if (stripeZeroDecimalCurrencies.includes(currency)) {
        return decimalify(amount);
    }
    else if (stripeThreeDecimalCurrencies.includes(currency)) {
        return decimalify(amount / 1000);
    }
    else {
        return decimalify(amount / 100);
    } // if
}
