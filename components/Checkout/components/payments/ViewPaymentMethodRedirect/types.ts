// reusable-ui components:
import {
    // dialog-components:
    type ModalExpandedChangeEvent,
    
    
    
    // utility-components:
    type ModalBaseProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// models:
import {
    type PaymentDetail,
    type PlaceOrderDetail,
}                           from '@/models'



export interface BaseRedirectDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<PaymentDetail|false|0> = ModalExpandedChangeEvent<PaymentDetail|false|0>>
    extends
        // bases
        ModalBaseProps<TElement, TModalExpandedChangeEvent>
{
    // data:
    placeOrderDetail : Omit<PlaceOrderDetail, 'redirectData'> & Required<Pick<PlaceOrderDetail, 'redirectData'>>
    
    
    
    // accessibilities:
    appName          : string
}
