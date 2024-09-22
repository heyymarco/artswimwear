'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    Basic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    List,
    
    
    
    // status-components:
    Busy,
    
    
    
    // notification-components:
    Alert,
    
    
    
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
    type WysiwygEditorState,
    
    WysiwygViewer,
}                           from '@/components/editors/WysiwygEditor'
import {
    TimezoneEditor,
}                           from '@/components/editors/TimezoneEditor'
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
        ImplementedComplexEditModelDialogProps<PublicOrderDetail>
{
}
const EditOrderDialog = (props: EditOrderDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditOrderDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model : modelRaw,
    ...restComplexEditModelDialogProps} = props;
    const model = modelRaw!;
    
    
    
    // sessions:
    const { data: session } = useSession();
    
    
    
    // apis:
    const {data: shippingList, isLoading: isLoadingShipping  , isError: isErrorShipping  , refetch: refetchShipping   }  = useGetShippingList();
    const {data: preference  , isLoading: isLoadingPreference, isError: isErrorPreference, refetch: refetchPreference }  = useGetPreference();
    const {
        orderStatus,
        cancelationReason,
        
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
    
    const shippingProvider       = !shippingProviderId ? undefined : shippingList?.entities?.[shippingProviderId];
    
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
    
    
    
    // statuses:
    const isLoading = (
        // have any loading(s):
        
        (
            !!shippingAddressDetail // IGNORE shippingLoading if no shipping required
            &&
            isLoadingShipping
        )
        ||
        isLoadingPreference
        /* isOther1Loading */
        /* isOther2Loading */
        /* isOther3Loading */
    );
    const isError   = (
        !isLoading // while still LOADING => consider as NOT error
        &&
        (
            // have any error(s):
            
            (
                !!shippingAddressDetail // IGNORE shippingError if no shipping required
                &&
                isErrorShipping
            )
            ||
            isErrorPreference
            /* isOther1Error */
            /* isOther2Error */
            /* isOther3Error */
        )
    );
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleViewShipment         = useEvent(() => {
        const token = shipment?.token;
        if (!token) return;
        
        
        
        showDialog(
            <ViewShipmentDialog
                // data:
                token={token}
            />
        );
    });
    
    const refetchModel               = useEvent((): void => {
        if (isErrorShipping   && !isLoadingShipping  ) refetchShipping();
        if (isErrorPreference && !isLoadingPreference) refetchPreference();
    });
    
    
    
    // jsx:
    const OrderAndShipping = (): JSX.Element|null => {
        // jsx:
        return (
            <>
                <Section
                    // accessibilities:
                    title='Order List'
                    
                    
                    
                    // variants:
                    theme={
                        (
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
                            (
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
                            />
                        )}
                    </List>
                    <hr />
                    <p className='currencyBlock'>
                        Subtotal <span className='currency'>
                            <CurrencyDisplay currency={currency} currencyRate={1 /* do not convert foreign currency to cartCurrency, just display as is */} amount={totalProductPrice} />
                        </span>
                    </p>
                    {!!shippingAddressDetail && <>
                        <p className='currencyBlock'>
                            Shipping <span className='currency'>
                                <CurrencyDisplay currency={currency} currencyRate={1 /* do not convert foreign currency to cartCurrency, just display as is */} amount={totalShippingCosts} />
                            </span>
                        </p>
                    </>}
                    <hr />
                    <p className='currencyBlock totalCost'>
                        Total <span className='currency'>
                            <CurrencyDisplay currency={currency} currencyRate={1 /* do not convert foreign currency to cartCurrency, just display as is */} amount={[
                                totalProductPrice,
                                totalShippingCosts,
                            ]} />
                        </span>
                    </p>
                </Section>
                
                {!!shippingAddressDetail && <>
                    <Section title='Deliver To' theme='secondary' className={styleSheet.orderDeliverySection}>
                        <Basic tag='strong' className={`${styleSheet.badge} ${styleSheet.shippingBadge}`}>
                            {shippingProvider?.name ?? 'DELETED SHIPPING PROVIDER'}
                            
                            {!!shipment?.number && !!shipment.token && <ButtonIcon
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
            
            
            
            // stores:
            isModelLoading = {isLoading}
            isModelError   = {isError}
            onModelRetry   = {refetchModel}
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
                            controlComponent={null}
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
                                className={styleSheet.noteBodyFull}
                            >
                                {!cancelationReason && <span
                                    // classes:
                                    className={`${styleSheet.noteEmpty} txt-sec`}
                                >
                                    -- no cancelation reason --
                                </span>}
                                {!!cancelationReason && <WysiwygViewer
                                    // variants:
                                    nude={true}
                                    
                                    
                                    
                                    // values:
                                    value={(cancelationReason ?? null) as unknown as WysiwygEditorState|undefined}
                                />}
                            </Content>}
                            {isExpired && <Basic
                                // variants:
                                mild={true}
                                
                                
                                
                                // classes:
                                className={styleSheet.noteBodyExpired}
                            >
                                {!!paymentExpiresAt && <span className={styleSheet.dateTime}>
                                    <DateTimeDisplay dateTime={paymentExpiresAt} timezone={preferredTimezone} showTimezone={false} />
                                </span>}
                                
                                <TimezoneEditor
                                    // variants:
                                    theme='danger'
                                    
                                    
                                    
                                    // values:
                                    value={preferredTimezone}
                                    onChange={setPreferredTimezone}
                                />
                            </Basic>}
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
                                        <CurrencyDisplay currency={currency} currencyRate={1 /* do not convert foreign currency to cartCurrency, just display as is */} amount={paymentAmount} />
                                    </strong>
                                </DataTableItem>
                            </DataTableBody>
                        </DataTable>}
                        
                        {/* unpaid => shows alert, payment confirmation (if any), and action buttons */}
                        {!isPaid && <>
                            {!hasPaymentConfirmation && <Alert
                                // variants:
                                theme='warning'
                                
                                
                                
                                // classes:
                                className={styleSheet.paymentConfirmationAlert}
                                
                                
                                
                                // states:
                                expanded={true}
                                
                                
                                
                                // components:
                                controlComponent={null}
                            >
                                <p>
                                    You have not made a payment.
                                </p>
                                <p>
                                    Please <strong>follow the payment instructions</strong> sent to your email{!!session?.user?.email && <>: <strong className={styleSheet.data}>{session.user.email}</strong></>}.
                                </p>
                                {/* TODO: display payment instructions here, without seeing the email */}
                            </Alert>}
                            
                            {hasPaymentConfirmation && <>
                                {!isPaymentRejected && <Alert
                                    // variants:
                                    theme='success'
                                    
                                    
                                    
                                    // classes:
                                    className={styleSheet.paymentConfirmationAlert}
                                    
                                    
                                    
                                    // states:
                                    expanded={true}
                                    
                                    
                                    
                                    // components:
                                    controlComponent={null}
                                >
                                    <p>
                                        You have <strong>confirmed your payment</strong>.
                                    </p>
                                    <p>
                                        Please wait a moment, we will <strong>verify your payment</strong> soon.
                                    </p>
                                </Alert>}
                                
                                {isPaymentRejected && <Alert
                                    // variants:
                                    theme='danger'
                                    
                                    
                                    
                                    // classes:
                                    className={styleSheet.paymentConfirmationAlert}
                                    
                                    
                                    
                                    // states:
                                    expanded={true}
                                    
                                    
                                    
                                    // components:
                                    controlComponent={null}
                                >
                                    <p>
                                        We are sorry, your payment confirmation was <strong>rejected</strong> because the information you submitted was invalid.
                                    </p>
                                    <p>
                                        But don&apos;t worry, you can <strong>update</strong> the payment confirmation. We will check it again and notify you back.
                                    </p>
                                    
                                    <hr />
                                    
                                    <p>
                                        Rejection reason:
                                    </p>
                                    <WysiwygViewer
                                        // variants:
                                        nude={true}
                                        
                                        
                                        
                                        // values:
                                        value={(paymentConfirmation.rejectionReason ?? null) as WysiwygEditorState|null}
                                    />
                                </Alert>}
                                
                                <DataTable className={styleSheet.dataTable} breakpoint='sm'>
                                    <DataTableHeader tableTitleComponent={<Basic />}>
                                        Payment Confirmation
                                    </DataTableHeader>
                                    <DataTableBody>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Reviewed At'
                                        >
                                            {
                                                paymentConfirmation.reviewedAt
                                                ? <>
                                                    <span className={styleSheet.dateTime}>
                                                        <DateTimeDisplay dateTime={paymentConfirmation.reviewedAt} timezone={preferredTimezone} showTimezone={false} />
                                                    </span>
                                                    
                                                    <TimezoneEditor
                                                        // variants:
                                                        theme='primary'
                                                        mild={true}
                                                        
                                                        
                                                        
                                                        // values:
                                                        value={preferredTimezone}
                                                        onChange={setPreferredTimezone}
                                                    />
                                                </>
                                                : <span className='txt-sec'>not yet reviewed</span>
                                            }
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Reported At'
                                        >
                                            {!!paymentConfirmation.reportedAt && <span className={styleSheet.dateTime}>
                                                <DateTimeDisplay dateTime={paymentConfirmation.reportedAt} timezone={preferredTimezone} showTimezone={false} />
                                            </span>}
                                            
                                            <TimezoneEditor
                                                // variants:
                                                theme='primary'
                                                mild={true}
                                                
                                                
                                                
                                                // values:
                                                value={preferredTimezone}
                                                onChange={setPreferredTimezone}
                                            />
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Amount'
                                            
                                            
                                            
                                            // components:
                                            tableDataComponent={<Generic className={styleSheet.tableDataAmount} />}
                                        >
                                            <strong>
                                                <CurrencyDisplay currency={currency} currencyRate={1 /* do not convert foreign currency to cartCurrency, just display as is */} amount={paymentConfirmation.amount} />
                                            </strong>
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Payer'
                                        >
                                            {paymentConfirmation.payerName}
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Payment Date'
                                        >
                                            {!!paymentConfirmation.paymentDate && <span className={styleSheet.dateTime}>
                                                <DateTimeDisplay dateTime={paymentConfirmation.paymentDate} timezone={preferredTimezone} showTimezone={false} />
                                            </span>}
                                            
                                            <TimezoneEditor
                                                // variants:
                                                theme='primary'
                                                mild={true}
                                                
                                                
                                                
                                                // values:
                                                value={preferredTimezone}
                                                onChange={setPreferredTimezone}
                                            />
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Originating Bank'
                                        >
                                            {paymentConfirmation.originatingBank}
                                        </DataTableItem>
                                        <DataTableItem
                                            // accessibilities:
                                            label='Destination Bank'
                                        >
                                            {paymentConfirmation.destinationBank}
                                        </DataTableItem>
                                    </DataTableBody>
                                </DataTable>
                                {/* TODO: add a button to update the payment confirmation */}
                            </>}
                            
                            <div className={styleSheet.paymentConfirmActions}>
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
