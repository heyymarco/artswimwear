// models:
import {
    // types:
    type CustomerDetail,
}                           from '@/models'



declare module 'next-auth' {
    interface Session
    {
        user ?: Pick<CustomerDetail, 'id'|'name'|'email'|'image'>
    }
}
