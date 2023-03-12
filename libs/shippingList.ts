export default [
    {
        name           : 'Free Shipping',
        estimate       : undefined,
        weightStep     : 0,
        shippingRates  : [
            { startingWeight: 0, rate: 0 }
        ]
    },
    {
        name           : 'WorldWide Shipping',
        estimate       : undefined,
        weightStep     : 1,
        shippingRates  : [
            { startingWeight: 0, rate: 20 }
        ]
    },
]