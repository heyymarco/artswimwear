// zod:
import {
    z,
}                           from 'zod'
import {
    type PaymentType,
}                           from '@prisma/client'



// schemas:
export const PaymentTypeSchema = z.enum([
    'CARD',
    'PAYPAL',
    'EWALLET',
    'CUSTOM',
    'MANUAL',
    'MANUAL_PAID',
]) satisfies z.Schema<PaymentType>;
