'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
    useMemo,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    Basic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    IconProps,
    Icon,
    ButtonIcon,
    
    
    
    // layout-components:
    List,
    
    
    
    // status-components:
    Badge,
    Busy,
    
    
    
    // notification-components:
    Alert,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    
    
    
    // composite-components:
    Group,
    TabPanel,
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'
import {
    DataTableHeader,
    DataTableBody,
    DataTableItem,
    DataTable,
}                           from '@heymarco/data-table'

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    TimezoneEditor,
}                           from '@/components/editors/TimezoneEditor'
import {
    SelectCurrencyEditor,
}                           from '@/components/editors/SelectCurrencyEditor'
import {
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    ViewShipmentDialog,
}                           from '@/components/dialogs/ViewShipmentDialog'
import {
    DateTimeDisplay,
}                           from '@/components/DateTimeDisplay'
import {
    ViewCartItem,
}                           from './ViewCartItem'
import {
    CountDown,
}                           from './CountDown'

// models:
import {
    type PublicOrderDetail,
    
    
    
    isKnownPaymentBrand,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetProductList,
    useGetShippingList,
    useGetPreference,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    useEditOrderDialogStyleSheet,
}                           from './styles/loader'

// others:
import {
    Country,
}                           from 'country-state-city'

// configs:
import {
    PAGE_ORDER_HISTORY_TAB_ORDER_N_SHIPPING,
    PAGE_ORDER_HISTORY_TAB_PAYMENT,
}                           from '@/website.config'
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// react components:
export interface EditOrderDialogProps
    extends
        // bases:
        Omit<ImplementedComplexEditModelDialogProps<PublicOrderDetail>,
            // auto focusable:
            |'autoFocusOn'
        >
{
    autoFocusOn ?: ImplementedComplexEditModelDialogProps<PublicOrderDetail>['autoFocusOn'] | 'OrderStatusButton' | 'ConfirmPaymentButton'
}
const EditOrderDialog = (props: EditOrderDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditOrderDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model : modelRaw,
        
        
        
        // auto focusable:
        autoFocusOn,
        
        
        
        // states:
        defaultExpandedTabIndex = (autoFocusOn === 'ConfirmPaymentButton') ? 1 : undefined,
    ...restComplexEditModelDialogProps} = props;
    const model = modelRaw!;
    
    
    
    // states:
    const [shouldTriggerAutoFocus, setShouldTriggerAutoFocus] = useState<boolean>(false);
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // stores:
    const {data: shippingList, isLoading: isLoadingShipping  , isError: isErrorShipping   }  = useGetShippingList();
    const {data: productList , isLoading: isLoadingProduct   , isError: isErrorProduct    }  = useGetProductList();
    const {data: preference  , isLoading: isLoadingPreference, isError: isErrorPreference }  = useGetPreference();
    const {
        orderStatus,
        
        currency : preferredCurrency,
        
        items,
        
        shippingAddress    : shippingAddressDetail,
        shippingProviderId : shippingProviderId,
        shippingCost       : totalShippingCosts,
        
        payment,
        
        paymentConfirmation,
        shipment,
    } = model ?? {};
    const {
        type           : paymentType,
        brand          : paymentBrand,
        identifier     : paymentIdentifier,
        expiresAt      : paymentExpiresAt,
        
        amount         : paymentAmount,
    } = payment ?? {};
    
    const {
        timezone : customerOrGuestPreferredTimezone,
    } = preference ?? {};
    
    const currency = preferredCurrency ?? checkoutConfigShared.intl.defaultCurrency;
    
    const [preferredTimezone, setPreferredTimezone] = useState<number>(() => customerOrGuestPreferredTimezone ?? checkoutConfigShared.intl.defaultTimezone);
    
    const shippingProvider       = shippingList?.entities?.[shippingProviderId ?? ''];
    
    const totalProductPrice      = items?.reduce((accum, {price, quantity}) => {
        return accum + (price * quantity);
    }, 0) ?? 0;
    
    const isCanceled             = (orderStatus === 'CANCELED');
    const isExpired              = (orderStatus === 'EXPIRED');
    const isCanceledOrExpired    = isCanceled || isExpired;
    const isPaid                 = !isCanceledOrExpired && (paymentType !== 'MANUAL');
    const isManualPaid           = !isCanceledOrExpired && (paymentType === 'MANUAL_PAID') && !paymentBrand /* assumes 'MANUAL_PAID' with 'indomaret'|'alfamart' as auto_payment */;
    const hasPaymentConfirmation = !!paymentConfirmation?.reportedAt;
    const isPaymentRejected      = hasPaymentConfirmation && !!paymentConfirmation.rejectionReason;
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    type EditMode = Exclude<keyof PublicOrderDetail, 'id'>
    
    
    
    // handlers:
    const handleViewShipment         = useEvent(() => {
        const token = model.shipment?.token;
        if (!token) return;
        
        
        
        showDialog(
            <ViewShipmentDialog
                // data:
                token={token}
            />
        );
    });
    
    const handleExpandedEnd          = useEvent(() => {
        setShouldTriggerAutoFocus(true);
    });
    
    
    
    // refs:
    const autoFocusRef = useRef<HTMLElement|null>(null);
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        if (!shouldTriggerAutoFocus) return;
        if (typeof(autoFocusOn) !== 'string') return;
        const autoFocusElm = autoFocusRef.current;
        if (!autoFocusElm) return;
        
        
        
        // setups:
        let cancelAutoFocus = setTimeout(() => {
            autoFocusElm.scrollIntoView({
                behavior : 'smooth',
            });
            cancelAutoFocus = setTimeout(() => {
                autoFocusElm.focus({
                    preventScroll : true,
                });
                setShouldTriggerAutoFocus(false);
            }, 500);
        }, 100);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelAutoFocus);
        };
    }, [shouldTriggerAutoFocus, autoFocusOn]);
    
    
    
    // jsx:
    const OrderAndShipping = ({printMode = false}): JSX.Element|null => {
        // jsx:
        return (
            <>
                <Section
                    // accessibilities:
                    title='Order List'
                    
                    
                    
                    // variants:
                    theme={
                        printMode
                        ? 'light'           // a light theme for white_paper friendly prints
                        : (
                            isCanceledOrExpired
                            ? 'danger'      // a danger theme for CANCELED|EXPIRED orders
                            : (
                                isPaid
                                ? 'primary' // a default theme for   PAID orders
                                : 'danger'  // a danger  theme for UNPAID orders
                            )
                        )
                    }
                    
                    
                    
                    // classes:
                    className={styleSheet.orderShippingSection}
                >
                    <Basic
                        // semantics:
                        tag='strong'
                        
                        
                        
                        // variants:
                        theme={
                            printMode
                            ? 'inherit'         // an inherit theme for white_paper friendly prints
                            : (
                                isCanceledOrExpired
                                ? 'danger'      // a danger theme for CANCELED|EXPIRED orders
                                : (
                                    isPaid
                                    ? 'success' // a success theme for   PAID orders
                                    : 'danger'  // a danger  theme for UNPAID orders
                                )
                            )
                        }
                        
                        
                        
                        // classes:
                        className={styleSheet.badge}
                    >{
                        isCanceledOrExpired
                        ? (
                            isCanceled
                            ? 'ORDER CANCELED' // a  canceled_order label
                            : 'ORDER EXPIRED'  // an expired_order  label
                        )
                        : (
                            isPaid
                            ? 'PAID'           // a    paid_order label
                            : 'UNPAID'         // an unpaid_order label
                        )
                    }</Basic>
                    <List className={styleSheet.viewCart} listStyle={['flush', 'numbered']}>
                        {items?.map(({price: unitPrice, quantity, productId, variantIds}, itemIndex) =>
                            <ViewCartItem
                                // identifiers:
                                key={`${productId}/${variantIds.join('/')}` || itemIndex}
                                
                                
                                
                                // data:
                                currency={currency}
                                
                                unitPrice={unitPrice}
                                quantity={quantity}
                                
                                
                                
                                // relation data:
                                productId={productId}
                                variantIds={variantIds}
                                productList={productList}
                            />
                        )}
                    </List>
                    <hr />
                    <p className='currencyBlock'>
                        Subtotal <span className='currency'>
                            <CurrencyDisplay currency={currency} amount={totalProductPrice} />
                        </span>
                    </p>
                    {!!shippingAddressDetail && <>
                        <p className='currencyBlock'>
                            Shipping <span className='currency'>
                                <CurrencyDisplay currency={currency} amount={totalShippingCosts} />
                            </span>
                        </p>
                    </>}
                    <hr />
                    <p className='currencyBlock totalCost'>
                        Total <span className='currency'>
                            <CurrencyDisplay currency={currency} amount={[totalProductPrice, totalShippingCosts]} />
                        </span>
                    </p>
                </Section>
                
                {!!shippingAddressDetail && <>
                    {printMode && <Content theme='danger' outlined={true} nude={true} className={styleSheet.printSpacer}>
                        <Icon className='scissors' icon='content_cut' />
                        <hr className='line' />
                    </Content>}
                    
                    <Section title='Deliver To' theme={printMode ? 'light' : 'secondary'} className={styleSheet.orderDeliverySection}>
                        <Basic tag='strong' className={`${styleSheet.badge} ${styleSheet.shippingBadge}`}>
                            {
                                isLoadingShipping
                                ? <Busy />
                                : isErrorShipping
                                    ? 'Error getting shipping data'
                                    : (shippingProvider?.name ?? 'DELETED SHIPPING PROVIDER')
                            }
                            
                            {!printMode && !!shipment?.number && !!shipment.token && <ButtonIcon
                                // appearances:
                                icon='my_location'
                                
                                
                                
                                // variants:
                                theme='primary'
                                buttonStyle='link'
                                
                                
                                
                                // classes:
                                className='btnPrint'
                                
                                
                                
                                // accessibilities:
                                title='View Shipping Tracking'
                                
                                
                                
                                // handlers:
                                onClick={handleViewShipment}
                            >Track</ButtonIcon>}
                        </Basic>
                        <div className={styleSheet.shippingAddress}>
                            <p>
                                <strong>{shippingAddressDetail.firstName} {shippingAddressDetail.lastName}</strong>
                            </p>
                            <p>
                                {shippingAddressDetail.address}
                                <br />
                                {`${shippingAddressDetail.city}, ${shippingAddressDetail.state} (${shippingAddressDetail.zip}), ${Country.getCountryByCode(shippingAddressDetail.country)?.name ?? shippingAddressDetail.country}`}
                            </p>
                            <p>
                                Phone: {shippingAddressDetail.phone}
                            </p>
                        </div>
                    </Section>
                </>}
                
                {printMode && <Content theme='danger' outlined={true} nude={true} className={styleSheet.printSpacer}>
                    <Icon className='scissors' icon='content_cut' />
                    <hr className='line' />
                </Content>}
            </>
        );
    };
    return (
        <ComplexEditModelDialog<PublicOrderDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Order'
            modelEntryName={`#ORDER_${model?.id}`}
            model={model}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={(typeof(autoFocusOn) === 'string') ? undefined : autoFocusOn}
            
            
            
            // handlers:
            onExpandEnd={handleExpandedEnd}
        >
            <TabPanel label={PAGE_ORDER_HISTORY_TAB_ORDER_N_SHIPPING} panelComponent={<Generic className={styleSheet.orderShippingTab} />}>
                <OrderAndShipping />
            </TabPanel>
            <TabPanel label={PAGE_ORDER_HISTORY_TAB_PAYMENT}          panelComponent={<Generic className={styleSheet.paymentTab} />}>
                <Section className={styleSheet.paymentSection}>
                    {isCanceledOrExpired && <>
                        <Alert
                            // appearances:
                            icon={isCanceled ? 'cancel_presentation' : 'timer_off'}
                            
                            
                            
                            // variants:
                            theme='danger'
                            mild={false}
                            
                            
                            
                            // classes
                            className={styleSheet.paymentAlert}
                            
                            
                            
                            // states:
                            expanded={true}
                            
                            
                            
                            // components:
                            controlComponent={<React.Fragment />}
                        >
                            {isCanceled && <>
                                <p>
                                    The order was canceled.
                                </p>
                            </>}
                            {isExpired && <>
                                <p>
                                    The order has expired.
                                </p>
                            </>}
                        </Alert>
                        <Group
                            // variants:
                            theme='danger'
                            orientation='block'
                            
                            
                            
                            // classes
                            className={styleSheet.paymentNote}
                        >
                            <Basic
                                // classes:
                                className={styleSheet.noteHeader}
                            >
                                {isCanceled && <>Cancelation Reason</>}
                                {isExpired  && <>Expired Date</>}
                            </Basic>
                            {isCanceled && <Content
                                // classes:
                                className={styleSheet.noteBody}
                            >
                                {/* TODO display cancelation reason */}
                            </Content>}
                            {isExpired && <>
                                {!!paymentExpiresAt && <span className={styleSheet.dateTime}>
                                    <DateTimeDisplay dateTime={paymentExpiresAt} timezone={preferredTimezone} showTimezone={false} />
                                </span>}
                                
                                <TimezoneEditor
                                    // variants:
                                    theme='primary'
                                    mild={true}
                                    
                                    
                                    
                                    // values:
                                    value={preferredTimezone}
                                    onChange={setPreferredTimezone}
                                />
                            </>}
                        </Group>
                    </>}
                    
                    {!isCanceledOrExpired && <>
                        {/* paid => displays payment information */}
                        {isPaid && <DataTable className={styleSheet.dataTable} breakpoint='sm'>
                            <DataTableBody>
                                <DataTableItem
                                    // accessibilities:
                                    label='Method'
                                >
                                    <span>
                                        {paymentType}
                                    </span>
                                </DataTableItem>
                                <DataTableItem
                                    // accessibilities:
                                    label={isManualPaid ? 'Type' : 'Provider'}
                                    
                                    
                                    
                                    // components:
                                    tableDataComponent={<Generic className={styleSheet.tableDataComposite} />}
                                >
                                    {
                                        (!!paymentBrand && isKnownPaymentBrand(paymentBrand))
                                        ? <img
                                            // appearances:
                                            alt={paymentBrand}
                                            src={`/brands/${paymentBrand.toLowerCase()}.svg`}
                                            // width={42}
                                            // height={26}
                                            
                                            
                                            
                                            // classes:
                                            className='paymentProvider'
                                        />
                                        : (paymentBrand || paymentType)
                                    }
                                    {!!paymentIdentifier && <span className='paymentIdentifier txt-sec'>
                                        ({paymentIdentifier})
                                    </span>}
                                </DataTableItem>
                                <DataTableItem
                                    // accessibilities:
                                    label='Amount'
                                    
                                    
                                    
                                    // components:
                                    tableDataComponent={<Generic className={styleSheet.tableDataAmount} />}
                                >
                                    <strong>
                                        <CurrencyDisplay currency={currency} amount={paymentAmount} />
                                    </strong>
                                </DataTableItem>
                            </DataTableBody>
                        </DataTable>}
                        
                        {/* unpaid => shows alert, payment confirmation (if any), and action buttons */}
                        {!isPaid && <>
                            {!hasPaymentConfirmation && <>
                                {/* TODO: display payment not confirmed */}
                            </>}
                            
                            {hasPaymentConfirmation && <>
                                {/* TODO: display payment is confirmed */}
                            </>}
                            
                            <div className={styleSheet.paymentConfirmActions}>
                                {hasPaymentConfirmation && <>
                                    {isPaymentRejected ? 'Payment Rejected' : 'Reject Payment'}
                                </>}
                                
                                {!!paymentExpiresAt && <CountDown paymentExpiresAt={paymentExpiresAt} />}
                            </div>
                        </>}
                    </>}
                </Section>
            </TabPanel>
        </ComplexEditModelDialog>
    );
};
export {
    EditOrderDialog,
    EditOrderDialog as default,
}
