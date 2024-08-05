import {
    prisma,
}                           from '@/libs/prisma.server'
import {getAllRates} from './shippings'
import {
    // utilities:
    defaultShippingOriginSelect,
}                           from '@/models'



const [shippingOrigin, shippingProviders] = await prisma.$transaction([
    prisma.defaultShippingOrigin.findFirst({
        select : defaultShippingOriginSelect,
    }),
    
    prisma.shippingProvider.findMany({
        where  : {
            visibility : { not: 'DRAFT' }, // allows access to ShippingProvider with visibility: 'PUBLISHED' but NOT 'DRAFT'
        },
        select : {
            // records:
            id         : true, // required for identifier
            
            
            
            // data:
            name       : true, // required for identifier
            
            weightStep : true, // required for calculate_shipping_cost algorithm
            eta        : {     // optional for matching_shipping algorithm
                select : {
                    // data:
                    min : true,
                    max : true,
                },
            },
            rates      : {     // required for calculate_shipping_cost algorithm
                select : {
                    // data:
                    start : true,
                    rate  : true,
                },
            },
            
            useZones   : true, // required for matching_shipping algorithm
        },
    }),
]);
if (shippingOrigin && shippingProviders.length) {
    await getAllRates(shippingProviders, {
        origin      : {
            ...shippingOrigin,
            country : 'US',
            state   : 'CA',
            city    : 'Redondo Beach',
            zip     : '90277',
            address : '179 N Harbor Dr',
        },
        destination : {
            country   : 'US',
            state     : 'CA',
            city      : 'San Francisco',
            zip       : '94104',
            address   : '417 montgomery street',
            
            firstName : 'John',
            lastName  : 'Smith',
            phone     : '415-123-4567',
        },
    });
}