
// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    updateShippingProviders,
}                           from './update-data.js'



await prisma.$transaction(async (prismaTransaction) => {
    await updateShippingProviders(prismaTransaction, {
        country : 'ID',
        state   : 'DKI JaKARta',
        city    : 'KoTa Administrasi JAKARTA PuSAT',
    });
})