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
        orderStatus,
        
        items,
        
        payment,
        paymentConfirmation,
    } = model;
    const paymentType = payment?.type;
    
    
    
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
