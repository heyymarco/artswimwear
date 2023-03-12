export default [
    {
        name           : 'Free Shipping',
        estimate       : undefined,
        weightStep     : 0,
        shippingRate   : [
            { startingWeight: 0, rate: 0 }
        ]
    },
    {
        name           : 'WorldWide Shipping',
        estimate       : undefined,
        weightStep     : 1,
        shippingRate   : [
            { startingWeight: 0, rate: 20 }
        ]
    },
]