'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// // next-auth:
// import {
//     useSession,
// }                           from 'next-auth/react'

// styles:
import {
    useOrderHistoryPreviewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Badge,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
import {
    PublicOrderStatusBadge,
}                           from '@/components/PublicOrderStatusBadge'
import {
    DateTimeDisplay,
}                           from '@/components/DateTimeDisplay'
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
import {
    EditOrderDialog,
}                           from '@/components/dialogs/EditOrderDialog'
import {
    ProductImage,
}                           from '@/components/views/ProductImage'
import {
    PaymentMethodBrand,
}                           from '@/components/payments/PaymentMethodBrand'

// models:
import {
    type PublicOrderDetail,
    
    
    
    publicOrderStatusTheme,
}                           from '@/models'

// internals:
import {
    // utilities:
    getTotalQuantity,
}                           from './utilities'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// defaults:
const minImageWidth = 155;  // 155px === (200px + (2* paddingBlock)) * aspectRatio === (200px + (2* 16px)) * 2/3



// react components:
export interface OrderHistoryPreviewProps extends ModelPreviewProps<PublicOrderDetail> {}
const OrderHistoryPreview = (props: OrderHistoryPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useOrderHistoryPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
    ...restListItemProps} = props;
    const {
        createdAt,
        
        id : orderId,
        
        currency     : preferredCurrency,
        
        shippingCost : totalShippingCosts,
        
        orderStatus,
        
        payment,
        paymentConfirmation,
        
        items,
    } = model;
    const paymentType = payment?.type;
    
    const currency            = preferredCurrency ?? checkoutConfigShared.intl.defaultCurrency;
    
    const totalProductPrice   = items?.reduce((accum, {price, quantity}) => {
        return accum + (price * quantity);
    }, 0) ?? 0;
    
    const isCanceled          = (orderStatus === 'CANCELED');
    const isExpired           = (orderStatus === 'EXPIRED');
    const isCanceledOrExpired = isCanceled || isExpired;
    const isPaid              = !isCanceledOrExpired && (!!payment && payment.type !== 'MANUAL');
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    type EditMode = 'full'
    const handleEdit = useEvent((editMode: EditMode): void => {
        // just for cosmetic backdrop:
        const dummyPromise = (
            ['full', 'full-status', 'full-payment'].includes(editMode)
            ? showDialog(
                <DummyDialog
                    // global stackable:
                    viewport={listItemRef}
                />
            )
            : undefined
        );
        
        const dialogPromise = showDialog((() => {
            switch (editMode) {
                case 'full' : return (
                    <EditOrderDialog
                        // data:
                        model={model} // modify current model
                    />
                );
                default     : throw new Error('app error');
            } // switch
        })());
        
        if (dummyPromise) {
            dialogPromise.collapseStartEvent().then(() => dummyPromise.closeDialog(undefined));
        } // if
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // variants:
            theme={publicOrderStatusTheme(orderStatus, paymentType, paymentConfirmation?.reportedAt, paymentConfirmation?.reviewedAt)}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <h3 className='orderId'>
                #ORDER_{orderId}
                
                <PublicOrderStatusBadge
                    // data:
                    orderStatus={orderStatus}
                    paymentType={paymentType}
                    
                    reportedAt={paymentConfirmation?.reportedAt}
                    reviewedAt={paymentConfirmation?.reviewedAt}
                    
                    
                    
                    // classes:
                    className='orderStatus'
                />
            </h3>
            
            <p className='createdAt'>
                <DateTimeDisplay dateTime={createdAt} timezone={/* TODO: preferredTimezone */undefined} showTimezone={false} />
            </p>
            
            <p className='payment'>
                <span>
                    Payment:
                </span>
                
                {!isPaid && <span className='noValue'>not yet paid</span>}
                
                {isPaid && <span className='paymentValue'>
                    <CurrencyDisplay currency={currency} currencyRate={1 /* do not convert foreign currency to cartCurrency, just display as is */} amount={[totalProductPrice, totalShippingCosts]} />
                    
                    <span className='paymentMethod'>
                        <PaymentMethodBrand model={payment} />
                        
                        {!!payment.identifier && <span className='paymentIdentifier txt-sec'>
                            ({payment.identifier})
                        </span>}
                    </span>
                </span>}
            </p>
            
            <p className='fullEditor'>
                <EditButton icon='list' title='View the order details' className='fullEditor' buttonStyle='regular' onClick={() => handleEdit('full')}>
                    View Details
                </EditButton>
            </p>
            
            {/* carousel + total quantity */}
            <CompoundWithBadge
                // components:
                wrapperComponent={<React.Fragment />}
                badgeComponent={
                    <Badge
                        // classes:
                        className='floatingSumQuantity'
                        
                        
                        
                        // floatable:
                        floatingPlacement='left-start'
                        floatingShift={0}
                        floatingOffset={0}
                    >
                        {getTotalQuantity(items)} Item(s)
                    </Badge>
                }
                elementComponent={
                    <Basic
                        // variants:
                        mild={true}
                        
                        
                        
                        // classes:
                        className='preview'
                    >
                        {
                            !items.length
                            ? <Basic
                                // variants:
                                mild={true}
                                
                                
                                
                                // classes:
                                className='image noImage'
                            >
                                <Icon icon='image' size='xl' />
                            </Basic>
                            : <MiniCarousel
                                // variants:
                                theme='inherit'
                                
                                
                                
                                // classes:
                                className='image'
                            >
                                {items.map(({quantity, productId}, index: number) =>
                                    /* image + quantity */
                                    <CompoundWithBadge
                                        // identifiers:
                                        key={index}
                                        
                                        
                                        
                                        // components:
                                        wrapperComponent={<React.Fragment />}
                                        badgeComponent={
                                            <Badge
                                                // classes:
                                                className='floatingQuantity'
                                                
                                                
                                                
                                                // variants:
                                                floatingPlacement='right-start'
                                                floatingShift={0}
                                                floatingOffset={0}
                                            >
                                                {quantity}x
                                            </Badge>
                                        }
                                        elementComponent={
                                            <ProductImage
                                                // data:
                                                productId={productId}
                                                
                                                
                                                
                                                // appearances:
                                                sizes={`${minImageWidth}px`}
                                                
                                                
                                                
                                                // behaviors:
                                                priority={false}
                                                
                                                
                                                
                                                // classes:
                                                className='prodImg'
                                            />
                                        }
                                    />
                                )}
                            </MiniCarousel>
                        }
                    </Basic>
                }
            />
        </ListItem>
    );
};
export {
    OrderHistoryPreview,
    OrderHistoryPreview as default,
}
