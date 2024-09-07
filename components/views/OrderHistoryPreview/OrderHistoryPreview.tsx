'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// // next-js:
// import type {
//     Metadata,
// }                           from 'next'

// // next-auth:
// import {
//     useSession,
// }                           from 'next-auth/react'

// styles:
import {
    useOrderHistoryPreviewStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Badge,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationExplorer'
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

// models:
import {
    type PublicOrderDetail,
    
    publicOrderStatusTheme,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetProductList,
}                           from '@/store/features/api/apiSlice';

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    // utilities:
    getTotalQuantity,
}                           from './utilities'



// defaults:
const imageSize = 128;  // 128px



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
        
        currency,
        
        shippingCost : totalShippingCosts,
        
        orderStatus,
        
        payment,
        paymentConfirmation,
        
        items,
    } = model;
    const paymentType = payment?.type;
    
    const totalProductPrice   = items?.reduce((accum, {price, quantity}) => {
        return accum + (price * quantity);
    }, 0) ?? 0;
    
    const isCanceled          = (orderStatus === 'CANCELED');
    const isExpired           = (orderStatus === 'EXPIRED');
    const isCanceledOrExpired = isCanceled || isExpired;
    const isPaid              = !isCanceledOrExpired && (!!payment && payment.type !== 'MANUAL');
    
    
    
    // stores:
    const {
        data      : productList,
     // isLoading : isProductLoadingAndNoData,
    } = useGetProductList();
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
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
                
                {!isPaid && <span className='noValue'>not paid</span>}
                
                {isPaid && <span className='paymentValue'>
                    <CurrencyDisplay currency={currency} amount={[totalProductPrice, totalShippingCosts]} />
                    
                    <span className='paymentMethod'>
                        {
                            (!!payment.brand && [
                                // cards:
                                'visa', 'mastercard', 'amex', 'discover', 'jcb', 'maestro',
                                
                                // wallets:
                                'paypal',
                                'googlepay', 'applepay', 'amazonpay', 'link',
                                'gopay', 'shopeepay', 'dana', 'ovo', 'tcash', 'linkaja',
                                
                                // counters:
                                'indomaret', 'alfamart',
                            ].includes(payment.brand.toLowerCase()))
                            ? <img
                                // appearances:
                                alt={payment.brand}
                                src={`/brands/${payment.brand.toLowerCase()}.svg`}
                                // width={42}
                                // height={26}
                                
                                
                                
                                // classes:
                                className='paymentProvider'
                            />
                            : (payment.brand || paymentType)
                        }
                        
                        {!!payment.identifier && <span className='paymentIdentifier txt-sec'>
                            ({payment.identifier})
                        </span>}
                    </span>
                </span>}
            </p>
            
            <p className='fullEditor'>
                <EditButton icon='table_view' title='View the order details' className='fullEditor' buttonStyle='regular' onClick={() => { /* TODO */ }}>
                    View Details
                </EditButton>
            </p>
            
            {/* carousel + total quantity */}
            <CompoundWithBadge
                // components:
                wrapperComponent={<React.Fragment />}
                badgeComponent={
                    <Badge
                        // floatable:
                        floatingPlacement='left-start'
                        floatingShift={10}
                        floatingOffset={-40}
                    >
                        {getTotalQuantity(items)} Item(s)
                    </Badge>
                }
                elementComponent={
                    <MiniCarousel
                        // classes:
                        className='images'
                    >
                        {items.map(({quantity, productId}, index: number) => {
                            const product = productList?.entities?.[`${productId}`];
                            
                            
                            
                            // jsx:
                            return (
                                /* image + quantity */
                                <CompoundWithBadge
                                    // identifiers:
                                    key={index}
                                    
                                    
                                    
                                    // components:
                                    wrapperComponent={<React.Fragment />}
                                    badgeComponent={
                                        <Badge
                                            // variants:
                                            floatingPlacement='right-start'
                                            floatingShift={10}
                                            floatingOffset={-40}
                                        >
                                            {quantity}x
                                        </Badge>
                                    }
                                    elementComponent={
                                        <Image
                                            className='prodImg'
                                            
                                            alt={`image #${index + 1} of ${product?.name ?? 'unknown product'}`}
                                            src={resolveMediaUrl(product?.image)}
                                            sizes={`${imageSize}px`}
                                            
                                            priority={true}
                                        />
                                    }
                                />
                            );
                        })}
                    </MiniCarousel>
                }
            />
        </ListItem>
    );
};
export {
    OrderHistoryPreview,
    OrderHistoryPreview as default,
}
