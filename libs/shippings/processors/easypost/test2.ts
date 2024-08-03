import {
    prisma,
}                           from '@/libs/prisma.server'
import {getAllRates} from './shippings'
import {
    // types:
    type DefaultShippingOriginDetail,
    
    
    
    // utilities:
    defaultShippingOriginSelect,
}                           from '@/models'



const shippingOrigin = await (async (): Promise<DefaultShippingOriginDetail|null> => {
    try {
        return await prisma.defaultShippingOrigin.findFirst({
            select : defaultShippingOriginSelect,
        });
    }
    catch {
        return null;
    } // try
})();
if (shippingOrigin) {
    await getAllRates(prisma, {
        ...shippingOrigin,
        country : 'US',
        state   : 'CA',
        city: 'Redondo Beach',
        zip: '90277',
        address: '179 N Harbor Dr',
    });
}