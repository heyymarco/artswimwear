
// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    updateShippingProvider,
}                           from './update-data.js'



await prisma.$transaction(async (prismaTransaction) => {
    await updateShippingProvider(prismaTransaction, {
        country : 'ID',
        state   : 'DKI JaKARta',
        city    : 'KoTa Administrasi JAKARTA PuSAT',
    });
})