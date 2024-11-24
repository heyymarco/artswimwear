'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // dialog-components:
    type ModalExpandedChangeEvent,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    RedirectDialog,
}                           from '@/components/dialogs/RedirectDialog'
import {
    QrisDialog,
}                           from '@/components/dialogs/QrisDialog'

// models:
import {
    type PaymentDetail,
}                           from '@/models'

// internals:
import {
    type BaseRedirectDialogProps,
}                           from './types'



export const defaultRedirectDialogComponent = (<RedirectDialog placeOrderDetail={undefined as any} appName={undefined as any} /> as React.ReactElement<BaseRedirectDialogProps<Element, ModalExpandedChangeEvent<PaymentDetail|false|0>>>);
export const qrisRedirectDialogComponent    = (<QrisDialog     placeOrderDetail={undefined as any} appName={undefined as any} /> as React.ReactElement<BaseRedirectDialogProps<Element, ModalExpandedChangeEvent<PaymentDetail|false|0>>>);