// stores:
import type {
    // types:
    CustomerDetail,
}                           from '@/store/features/api/apiSlice'



declare module 'next-auth' {
    interface Session
    {
        user ?: Pick<CustomerDetail, 'id'|'name'|'email'|'image'>
    }
}
