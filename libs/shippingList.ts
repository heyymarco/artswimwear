export default [
    {
        name           : 'Free Shipping',
        weightStep     : 0,
        shippingRate   : [
            { startingWeight: 0, rate: 0 }
        ]
    },
    {
        name           : 'WorldWide Shipping',
        weightStep     : 1,
        shippingRate   : [
            { startingWeight: 0, rate: 20 }
        ]
    },
]