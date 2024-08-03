// models:
import {
    // utilities:
    defaultShippingOriginSelect,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    updateShippingProviders,
}                           from './update-data.js'



await prisma.$transaction(async (prismaTransaction) => {
    const origin = await prismaTransaction.defaultShippingOrigin.findFirst({
        select : defaultShippingOriginSelect,
    });
    if (!origin) return;
    await updateShippingProviders(prismaTransaction, origin, {
        country : 'ID',
        state   : 'Jawa Timur',
        city    : 'Surabaya',
    });
})