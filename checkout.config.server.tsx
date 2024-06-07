// themes:
import './theme.basics.config'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a border (stroke) management system:
    borderRadiusValues,
    
    
    
    // a spacer (gap) management system
    spacerValues,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// templates:
import * as styles          from '@/components/Checkout/templates/styles'
import {
    // react components:
    Business,
}                           from '@/components/Checkout/templates/Business'
import {
    // react components:
    Customer,
}                           from '@/components/Checkout/templates/Customer'
import {
    // react components:
    Admin,
}                           from '@/components/Checkout/templates/Admin'
import {
    // react components:
    Shipping,
}                           from '@/components/Checkout/templates/Shipping'
import {
    // react components:
    Payment,
}                           from '@/components/Checkout/templates/Payment'
import {
    // react components:
    Order,
}                           from '@/components/Checkout/templates/Order'
import {
    // react components:
    IfPaid,
}                           from '@/components/Checkout/templates/IfPaid'
import {
    // react components:
    IfPaidAuto,
}                           from '@/components/Checkout/templates/IfPaidAuto'
import {
    // react components:
    IfPaidManual,
}                           from '@/components/Checkout/templates/IfPaidManual'
import {
    // react components:
    IfNotPaid,
}                           from '@/components/Checkout/templates/IfNotPaid'
import {
    // react components:
    IfPhysicalProduct,
}                           from '@/components/Checkout/templates/IfPhysicalProduct'
import {
    // react components:
    IfNotPhysicalProduct,
}                           from '@/components/Checkout/templates/IfNotPhysicalProduct'

// configs:
import type {
    CheckoutConfigServer,
}                           from '@/components/Checkout/types'

// internals:
import {
    checkoutConfigShared,
}                               from './checkout.config.shared'



export const checkoutConfigServer  : CheckoutConfigServer = {
    business                       : checkoutConfigShared.business,
    intl                           : checkoutConfigShared.intl,
    payment                        : {
        bank                       : <article>
            <table style={{...styles.tableReset, ...styles.selfCenterHorz}}><tbody><tr><td>
                <table style={styles.tableInfoFill}>
                    <thead>
                        <tr>
                            <th colSpan={2} style={styles.tableTitleCenter}>
                                ABC Bank
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th style={styles.tableTitleSide}>
                                Account
                            </th>
                            <td style={styles.tableContentSide}>
                                123456789
                            </td>
                        </tr>
                        
                        <tr>
                            <th style={styles.tableTitleSideLast}>
                                Name of
                            </th>
                            <td style={styles.tableContentSideLast}>
                                Smith John
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <table style={styles.tableInfoFill}>
                    <thead>
                        <tr>
                            <th colSpan={2} style={styles.tableTitleCenter}>
                            XYZ Bank
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th style={styles.tableTitleSide}>
                                Account
                            </th>
                            <td style={styles.tableContentSide}>
                                ABCDEFG
                            </td>
                        </tr>
                        
                        <tr>
                            <th style={styles.tableTitleSideLast}>
                                Name of
                            </th>
                            <td style={styles.tableContentSideLast}>
                                John Smith
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td></tr></tbody></table>
        </article>,
        confirmationUrl            : '/checkout/payment-confirmation',
        expires : {
            manual                 : 2 /* days */,
            cstore                 : 2 /* days */,
        },
    },
    shipping                       : {
        trackingUrl                : '/checkout/shipping-tracking',
    },
    customerEmails                 : {
        checkout                   : {
            host                   : process.env.EMAIL_CHECKOUT_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_CHECKOUT_PORT ?? '465'),
            secure                 : (process.env.EMAIL_CHECKOUT_SECURE === 'true'),
            username               : process.env.EMAIL_CHECKOUT_USERNAME ?? '',
            password               : process.env.EMAIL_CHECKOUT_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_CHECKOUT_FROM ?? '',
            subject                : <>
                <IfNotPaid>
                    Awaiting Payment for Your Order at <Business.Name />
                </IfNotPaid>
                
                <IfPaidManual>
                    Your Payment at <Business.Name />
                </IfPaidManual>
                
                <IfPaidAuto>
                    Your Order at <Business.Name />
                </IfPaidAuto>
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        <IfNotPaid>
                            Awaiting Payment for Your Order...
                        </IfNotPaid>
                        
                        <IfPaidManual>
                            Thanks for Your Payment!
                        </IfPaidManual>
                        
                        <IfPaidAuto>
                            Thanks for Your Order!
                        </IfPaidAuto>
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Customer.Name />,
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        <IfNotPaid>
                            Thank you for placing an order at <strong><Business.Name /></strong>.
                            <br />
                            We are pleased to confirm that we have received your order and are <strong>waiting for your payment</strong> so that your order can be processed further.
                        </IfNotPaid>
                        
                        <IfPaidManual>
                            Thank you for your payment of the order at <strong><Business.Name /></strong>.
                            <br />
                            We are pleased to confirm that the order is <strong>currently being processed</strong>.
                        </IfPaidManual>
                        
                        <IfPaidAuto>
                            Thank you for placing an order at <strong><Business.Name /></strong>.
                            <br />
                            We are pleased to confirm that we have received your order and it is <strong>currently being processed</strong>.
                        </IfPaidAuto>
                    </p>
                </section>
                
                <IfNotPaid>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Payment Instruction
                        </h2>
                        
                        <Payment.IsManualTransfer>
                            <p style={styles.paragraph}>
                                Please immediately make payment for your order to <strong>one of</strong> our accounts below:
                            </p>
                        </Payment.IsManualTransfer>
                        <Payment.IsManualOtc>
                            <p style={styles.paragraph}>
                                Please immediately make payment for your order via <strong><Payment.OtcBrand /> Store</strong>:
                            </p>
                        </Payment.IsManualOtc>
                        
                        <div
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                display      : 'block',
                                
                                
                                
                                // sizes:
                                width        : 'fit-content', // center self horizontally
                                
                                
                                
                                // backgrounds & foregrounds:
                                ...styles.theme('primary'),
                                
                                
                                
                                // borders:
                                border       : styles.borderStroke('primary'),
                                borderRadius : `${borderRadiusValues.xxl}`,
                                
                                
                                
                                // spacings:
                                marginTop    : `${spacerValues.md}`,
                                marginBottom : `${spacerValues.md}`,
                                marginLeft   : 'auto',
                                marginRight  : 'auto',
                                padding      : `calc(${spacerValues.md} * 1.5)`,
                            }}
                        >
                            <Payment.IsManualOtc>
                                <p style={styles.paragraphFirst}>
                                    Show this <strong>payment code</strong> to the <strong><Payment.OtcBrand /></strong> cashier:
                                    <br />
                                    <strong style={styles.textBigger}>
                                        <Payment.OtcCode />
                                    </strong>
                                </p>
                                <div style={styles.textSmall}>
                                    <p style={styles.paragraph}>
                                        After receiving proof of payment, the payment will <strong>automatically be verified</strong> by <Business.Name />.
                                    </p>
                                    <p style={styles.paragraphLast}>
                                        Save proof of payment which is needed at any time if there are transaction problems.
                                    </p>
                                </div>
                                <br />
                            </Payment.IsManualOtc>
                            
                            <p
                                // styles:
                                style={{
                                    // layouts:
                                    ...styles.paragraphFirst,
                                    
                                    
                                    
                                    // spacings:
                                    columnGap    : '0.5em',
                                    
                                    
                                    
                                    // typos:
                                    ...styles.textBig,
                                }}
                            >
                                <span>Amount:</span>
                                <br />
                                <Order.TotalValue />
                            </p>
                            <Payment.HasExpires>
                                <p style={styles.paragraphLast}>
                                    Please make payment <strong>before</strong>:
                                    <br />
                                    <strong style={styles.textSemibold}>
                                        <Payment.Expires />
                                    </strong>
                                    <br />
                                    <small style={styles.textSmall}>
                                        Your order will be automatically canceled after the above date passes.
                                    </small>
                                </p>
                            </Payment.HasExpires>
                        </div>
                        
                        <Payment.IsManualTransfer>
                            <Payment.Bank />
                            
                            <p
                                // styles:
                                style={{
                                    // layouts:
                                    ...styles.paragraphLast,
                                    
                                    
                                    
                                    // positions:
                                    // needs to overwrite the paragraph's layout
                                    ...styles.selfCenterHorz, // center self horizontally
                                    
                                    
                                    
                                    // sizes:
                                    width     : 'fit-content',
                                    
                                    
                                    
                                    // backgrounds & foregrounds:
                                    ...styles.theme('primary'),
                                    
                                    
                                    
                                    // borders:
                                    border       : styles.borderStroke('primary'),
                                    borderRadius : `${borderRadiusValues.xxl}`,
                                    
                                    
                                    
                                    // spacings:
                                    padding      : `calc(${spacerValues.md} * 1.5)`,
                                }}
                            >
                                After you make payment, please confirm your payment via this link:
                                <br />
                                <Payment.ConfirmationLink />
                            </p>
                        </Payment.IsManualTransfer>
                    </section>
                </IfNotPaid>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                        
                        <IfPhysicalProduct>
                            <IfPaid>
                                <hr style={styles.horzRule} />
                            </IfPaid>
                        </IfPhysicalProduct>
                    </div>
                    
                    <IfPhysicalProduct>
                        <IfPaid>
                            <p style={styles.paragraphLast}>
                                We will send you another shipping confirmation email as soon as your order has been dispatched from our warehouse.
                            </p>
                        </IfPaid>
                    </IfPhysicalProduct>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <IfPaid>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Payment Info
                        </h2>
                        
                        <Payment.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPaid>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Care Support
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        Need help? Please reply this email.
                    </p>
                </section>
            </article>,
        },
        
        canceled                   : {
            host                   : process.env.EMAIL_CANCELED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_CANCELED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_CANCELED_SECURE === 'true'),
            username               : process.env.EMAIL_CANCELED_USERNAME ?? '',
            password               : process.env.EMAIL_CANCELED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_CANCELED_FROM ?? '',
            subject                : <>
                Your Order Has Been Canceled at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        Your Order Has Been Canceled
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Customer.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        Your order has been <strong>canceled</strong>.
                        <br />
                        But don&apos;t worry, you can <strong>order again</strong> at <Business.Link />.
                    </p>
                    
                    <Order.HasCancelationReason>
                        <p style={styles.paragraphLast}>
                            Cancelation reason:
                            <br />
                            <Order.CancelationReason />
                        </p>
                    </Order.HasCancelationReason>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Care Support
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        Need help? Please reply this email.
                    </p>
                </section>
            </article>,
        },
        expired                    : {
            host                   : process.env.EMAIL_EXPIRED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_EXPIRED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_EXPIRED_SECURE === 'true'),
            username               : process.env.EMAIL_EXPIRED_USERNAME ?? '',
            password               : process.env.EMAIL_EXPIRED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_EXPIRED_FROM ?? '',
            subject                : <>
                Your Order Has Been Canceled at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        Your Order Has Been Canceled
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Customer.Name />,
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        Your order has been <strong>canceled</strong> because we have not received the payment by the final payment date.
                        <br />
                        But don&apos;t worry, you can <strong>order again</strong> at <Business.Link />.
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Care Support
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        Need help? Please reply this email.
                    </p>
                </section>
            </article>,
        },
        
        confirmed                  : {
            host                   : process.env.EMAIL_CONFIRMED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_CONFIRMED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_CONFIRMED_SECURE === 'true'),
            username               : process.env.EMAIL_CONFIRMED_USERNAME ?? '',
            password               : process.env.EMAIL_CONFIRMED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_CONFIRMED_FROM ?? '',
            subject                : <>
                We Have Received Your Payment Confirmation at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        Thanks for Your Payment Confirmation!
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Customer.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        We have received your payment confirmation.
                        <br />
                        We will immediately <strong>check your payment</strong> and will <strong>notify you</strong> in the next email.
                    </p>
                    
                    <p style={styles.paragraph}>
                        If there is a <strong>data mistake</strong> in your payment confirmation,
                        <br />
                        Don&apos;t worry, you can <strong>re-confirm</strong> it again. We will check your payment confirmation again.
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        Re-confirm:
                        <br />
                        <Payment.ConfirmationLink />
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Payment Instruction
                    </h2>
                    
                    <p style={styles.paragraph}>
                        Please immediately make payment for your order to <strong>one of</strong> our accounts below:
                    </p>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display      : 'block',
                            
                            
                            
                            // sizes:
                            width        : 'fit-content', // center self horizontally
                            
                            
                            
                            // backgrounds & foregrounds:
                            ...styles.theme('primary'),
                            
                            
                            
                            // borders:
                            border       : styles.borderStroke('primary'),
                            borderRadius : `${borderRadiusValues.xxl}`,
                            
                            
                            
                            // spacings:
                            marginTop    : `${spacerValues.md}`,
                            marginBottom : `${spacerValues.md}`,
                            marginLeft   : 'auto',
                            marginRight  : 'auto',
                            padding      : `calc(${spacerValues.md} * 1.5)`,
                        }}
                    >
                        <p
                            // styles:
                            style={{
                                // layouts:
                                ...styles.paragraphFirst,
                                
                                
                                
                                // spacings:
                                columnGap    : '0.5em',
                                
                                
                                
                                // typos:
                                ...styles.textBig,
                            }}
                        >
                            <span>Amount:</span>
                            <br />
                            <Order.TotalValue />
                        </p>
                        <Payment.HasExpires>
                            <p style={styles.paragraphLast}>
                                Please make payment <strong>before</strong>:
                                <br />
                                <strong style={styles.textSemibold}>
                                    <Payment.Expires />
                                </strong>
                                <br />
                                <small style={styles.textSmall}>
                                    Your order will be automatically canceled after the above date passes.
                                </small>
                            </p>
                        </Payment.HasExpires>
                    </div>
                    
                    <Payment.IsManualTransfer>
                        <Payment.Bank />
                        
                        <p
                            // styles:
                            style={{
                                // layouts:
                                ...styles.paragraphLast,
                                
                                
                                
                                // positions:
                                // needs to overwrite the paragraph's layout
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // sizes:
                                width     : 'fit-content',
                                
                                
                                
                                // backgrounds & foregrounds:
                                ...styles.theme('primary'),
                                
                                
                                
                                // borders:
                                border       : styles.borderStroke('primary'),
                                borderRadius : `${borderRadiusValues.xxl}`,
                                
                                
                                
                                // spacings:
                                padding      : `calc(${spacerValues.md} * 1.5)`,
                            }}
                        >
                            After you make payment, please confirm your payment via this link:
                            <br />
                            <Payment.ConfirmationLink />
                        </p>
                    </Payment.IsManualTransfer>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Care Support
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        Need help? Please reply this email.
                    </p>
                </section>
            </article>,
        },
        rejected                   : {
            host                   : process.env.EMAIL_REJECTED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_REJECTED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_REJECTED_SECURE === 'true'),
            username               : process.env.EMAIL_REJECTED_USERNAME ?? '',
            password               : process.env.EMAIL_REJECTED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_REJECTED_FROM ?? '',
            subject                : <>
                Your Payment Confirmation Rejected of Your Order at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        Sorry, Your Payment Confirmation Was Rejected
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Customer.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        We are sorry, your payment confirmation was <strong>rejected</strong> because the information you submitted was invalid.
                        <br />
                        But don&apos;t worry, you can <strong>resend</strong> it again. We will check your payment confirmation again.
                    </p>
                    
                    <Payment.HasConfirmationRejection>
                        <p style={styles.paragraph}>
                            Rejection reason:
                            <br />
                            <Payment.ConfirmationRejection />
                        </p>
                    </Payment.HasConfirmationRejection>
                    
                    <p style={styles.paragraphLast}>
                        Retry:
                        <br />
                        <Payment.ConfirmationLink />
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Payment Instruction
                    </h2>
                    
                    <p style={styles.paragraph}>
                        Please immediately make payment for your order to <strong>one of</strong> our accounts below:
                    </p>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display      : 'block',
                            
                            
                            
                            // sizes:
                            width        : 'fit-content', // center self horizontally
                            
                            
                            
                            // backgrounds & foregrounds:
                            ...styles.theme('primary'),
                            
                            
                            
                            // borders:
                            border       : styles.borderStroke('primary'),
                            borderRadius : `${borderRadiusValues.xxl}`,
                            
                            
                            
                            // spacings:
                            marginTop    : `${spacerValues.md}`,
                            marginBottom : `${spacerValues.md}`,
                            marginLeft   : 'auto',
                            marginRight  : 'auto',
                            padding      : `calc(${spacerValues.md} * 1.5)`,
                        }}
                    >
                        <p
                            // styles:
                            style={{
                                // layouts:
                                ...styles.paragraphFirst,
                                
                                
                                
                                // spacings:
                                columnGap    : '0.5em',
                                
                                
                                
                                // typos:
                                ...styles.textBig,
                            }}
                        >
                            <span>Amount:</span>
                            <br />
                            <Order.TotalValue />
                        </p>
                        <Payment.HasExpires>
                            <p style={styles.paragraphLast}>
                                Please make payment <strong>before</strong>:
                                <br />
                                <strong style={styles.textSemibold}>
                                    <Payment.Expires />
                                </strong>
                                <br />
                                <small style={styles.textSmall}>
                                    Your order will be automatically canceled after the above date passes.
                                </small>
                            </p>
                        </Payment.HasExpires>
                    </div>
                    
                    <Payment.IsManualTransfer>
                        <Payment.Bank />
                        
                        <p
                            // styles:
                            style={{
                                // layouts:
                                ...styles.paragraphLast,
                                
                                
                                
                                // positions:
                                // needs to overwrite the paragraph's layout
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // sizes:
                                width     : 'fit-content',
                                
                                
                                
                                // backgrounds & foregrounds:
                                ...styles.theme('primary'),
                                
                                
                                
                                // borders:
                                border       : styles.borderStroke('primary'),
                                borderRadius : `${borderRadiusValues.xxl}`,
                                
                                
                                
                                // spacings:
                                padding      : `calc(${spacerValues.md} * 1.5)`,
                            }}
                        >
                            After you make payment, please confirm your payment via this link:
                            <br />
                            <Payment.ConfirmationLink />
                        </p>
                    </Payment.IsManualTransfer>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Care Support
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        Need help? Please reply this email.
                    </p>
                </section>
            </article>,
        },
        
        shipping                   : {
            host                   : process.env.EMAIL_SHIPPING_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_SHIPPING_PORT ?? '465'),
            secure                 : (process.env.EMAIL_SHIPPING_SECURE === 'true'),
            username               : process.env.EMAIL_SHIPPING_USERNAME ?? '',
            password               : process.env.EMAIL_SHIPPING_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_SHIPPING_FROM ?? '',
            subject                : <>
                A Shipping Confirmation of Your Order at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        Your Order Is on the Way!
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Customer.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        Thank you for placing an order at <strong><Business.Name /></strong>.
                        <br />
                        We are pleased to confirm that your order is <strong>on its way</strong>.
                    </p>
                    <p style={styles.paragraphLast}>
                        Please use the link below to track shipping status:
                        <br />
                        <Shipping.TrackingLink />
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Shipping Info
                    </h2>
                    
                    <Shipping.Info style={styles.selfCenterHorz} />
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Care Support
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        Need help? Please reply this email.
                    </p>
                </section>
            </article>,
        },
        completed                  : {
            host                   : process.env.EMAIL_COMPLETED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_COMPLETED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_COMPLETED_SECURE === 'true'),
            username               : process.env.EMAIL_COMPLETED_USERNAME ?? '',
            password               : process.env.EMAIL_COMPLETED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_COMPLETED_FROM ?? '',
            subject                : <>
                Your Order Is Now Complete
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        <IfPhysicalProduct>
                            Your Order Has Arrived!
                        </IfPhysicalProduct>
                        <IfNotPhysicalProduct>
                            Your Order Has Been Processed!
                        </IfNotPhysicalProduct>
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Customer.Name />,
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        <IfPhysicalProduct>
                            It looks like you have received your order package.
                        </IfPhysicalProduct>
                        <IfNotPhysicalProduct>
                            Your order has been fully processed.
                        </IfNotPhysicalProduct>
                        <br />
                        Now your order status is marked as <strong>complete</strong>.
                    </p>
                    <p>
                        If you need help, please contact us by replying to this email.
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Care Support
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        Need help? Please reply this email.
                    </p>
                </section>
            </article>,
        },
    },
    adminEmails                    : {
        checkout                   : {
            host                   : process.env.EMAIL_ADMIN_CHECKOUT_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_ADMIN_CHECKOUT_PORT ?? '465'),
            secure                 : (process.env.EMAIL_ADMIN_CHECKOUT_SECURE === 'true'),
            username               : process.env.EMAIL_ADMIN_CHECKOUT_USERNAME ?? '',
            password               : process.env.EMAIL_ADMIN_CHECKOUT_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_ADMIN_CHECKOUT_FROM ?? '',
            subject                : <>
                <IfNotPaid>
                    Pending Order at <Business.Name />
                </IfNotPaid>
                
                <IfPaidManual>
                    New Order at <Business.Name />
                </IfPaidManual>
                
                <IfPaidAuto>
                    New Order at <Business.Name />
                </IfPaidAuto>
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        <IfNotPaid>
                            New Pending Order!
                        </IfNotPaid>
                        
                        <IfPaidManual>
                            New Order!
                        </IfPaidManual>
                        
                        <IfPaidAuto>
                            New Order!
                        </IfPaidAuto>
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Admin.Name />,
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        <IfNotPaid>
                            New order from <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span> but <strong>not yet paid</strong> for.
                            <br />
                            If necessary, please guide him/her to <strong>complete the payment</strong> so that you will not lose the order.
                        </IfNotPaid>
                        
                        <IfPaidManual>
                            New order from <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span>!
                            <br />
                            Please <strong>process the order immediately</strong>, so that he/she is satisfied with the fast service.
                        </IfPaidManual>
                        
                        <IfPaidAuto>
                            New order from <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span>!
                            <br />
                            Please <strong>process the order immediately</strong>, so that he/she is satisfied with the fast service.
                        </IfPaidAuto>
                    </p>
                </section>
                
                <IfNotPaid>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Payment Method
                        </h2>
                        
                        <Payment.IsManualTransfer>
                            <p style={styles.paragraph}>
                                He/she chose to pay manually via <strong>bank transfer</strong>.
                            </p>
                        </Payment.IsManualTransfer>
                        <Payment.IsManualOtc>
                            <p style={styles.paragraph}>
                                He/she chose to pay via <strong><Payment.OtcBrand /> Store</strong>:
                            </p>
                        </Payment.IsManualOtc>
                        
                        <div
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                display      : 'block',
                                
                                
                                
                                // sizes:
                                width        : 'fit-content', // center self horizontally
                                
                                
                                
                                // backgrounds & foregrounds:
                                ...styles.theme('primary'),
                                
                                
                                
                                // borders:
                                border       : styles.borderStroke('primary'),
                                borderRadius : `${borderRadiusValues.xxl}`,
                                
                                
                                
                                // spacings:
                                marginTop    : `${spacerValues.md}`,
                                marginBottom : `${spacerValues.md}`,
                                marginLeft   : 'auto',
                                marginRight  : 'auto',
                                padding      : `calc(${spacerValues.md} * 1.5)`,
                            }}
                        >
                            <Payment.IsManualOtc>
                                <p style={styles.paragraphFirst}>
                                    <Payment.OtcBrand /> <strong>payment code</strong>:
                                    <br />
                                    <strong style={styles.textBigger}>
                                        <Payment.OtcCode />
                                    </strong>
                                </p>
                                <div style={styles.textSmall}>
                                    <p style={styles.paragraph}>
                                        After <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span> completes the payment,
                                        <br />
                                        the system will automatically send <strong>an email notification of the new order</strong>.
                                    </p>
                                </div>
                                <br />
                            </Payment.IsManualOtc>
                            
                            <p
                                // styles:
                                style={{
                                    // layouts:
                                    ...styles.paragraphFirst,
                                    
                                    
                                    
                                    // spacings:
                                    columnGap    : '0.5em',
                                    
                                    
                                    
                                    // typos:
                                    ...styles.textBig,
                                }}
                            >
                                <span>Amount:</span>
                                <br />
                                <Order.TotalValue />
                            </p>
                            <Payment.HasExpires>
                                <p style={styles.paragraphLast}>
                                    The order will be <strong>automatically canceled</strong> after:
                                    <br />
                                    <strong style={styles.textSemibold}>
                                        <Payment.Expires />
                                    </strong>
                                </p>
                            </Payment.HasExpires>
                        </div>
                        
                        <Payment.IsManualTransfer>
                            <Payment.Bank />
                        </Payment.IsManualTransfer>
                    </section>
                </IfNotPaid>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                        
                        <IfPhysicalProduct>
                            <IfPaid>
                                <hr style={styles.horzRule} />
                            </IfPaid>
                        </IfPhysicalProduct>
                    </div>
                    
                    <IfPhysicalProduct>
                        <IfPaid>
                            <p style={styles.paragraphLast}>
                                We will send you another shipping confirmation email as soon as your order has been dispatched from our warehouse.
                            </p>
                        </IfPaid>
                    </IfPhysicalProduct>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <IfPaid>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Payment Info
                        </h2>
                        
                        <Payment.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPaid>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
            </article>,
        },
        
        canceled                   : {
            host                   : process.env.EMAIL_ADMIN_CANCELED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_ADMIN_CANCELED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_ADMIN_CANCELED_SECURE === 'true'),
            username               : process.env.EMAIL_ADMIN_CANCELED_USERNAME ?? '',
            password               : process.env.EMAIL_ADMIN_CANCELED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_ADMIN_CANCELED_FROM ?? '',
            subject                : <>
                An Order Has Been Canceled at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        An Order Has Been Canceled
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Admin.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        An order from <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span> has been <strong>canceled</strong>.
                        <br />
                        If necessary, please guide him/her to <strong>re-create a new order</strong> if he/she wants to resume the order.
                    </p>
                    
                    <Order.HasCancelationReason>
                        <p style={styles.paragraphLast}>
                            Cancelation reason:
                            <br />
                            <Order.CancelationReason />
                        </p>
                    </Order.HasCancelationReason>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
            </article>,
        },
        expired                    : {
            host                   : process.env.EMAIL_ADMIN_EXPIRED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_ADMIN_EXPIRED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_ADMIN_EXPIRED_SECURE === 'true'),
            username               : process.env.EMAIL_ADMIN_EXPIRED_USERNAME ?? '',
            password               : process.env.EMAIL_ADMIN_EXPIRED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_ADMIN_EXPIRED_FROM ?? '',
            subject                : <>
                An Order Has Been Canceled at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        An Order Has Been Canceled
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Admin.Name />,
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        An order from <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span> has been <strong>canceled</strong> because we have not received the payment by the final payment date.
                        <br />
                        If necessary, please guide him/her to <strong>re-create a new order</strong> if he/she wants to resume the order.
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
            </article>,
        },
        
        confirmed                  : {
            host                   : process.env.EMAIL_ADMIN_CONFIRMED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_ADMIN_CONFIRMED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_ADMIN_CONFIRMED_SECURE === 'true'),
            username               : process.env.EMAIL_ADMIN_CONFIRMED_USERNAME ?? '',
            password               : process.env.EMAIL_ADMIN_CONFIRMED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_ADMIN_CONFIRMED_FROM ?? '',
            subject                : <>
                A Payment Confirmation Has Been Received at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        A Payment Confirmation Has Been Received
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Admin.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        A <strong>payment confirmation</strong> from <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span>!
                        <br />
                        Please <strong>review the payment confirmation immediately</strong>, so that he/she is satisfied with the fast response.
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Payment Method
                    </h2>
                    
                    <p style={styles.paragraph}>
                        He/she chose to pay manually via <strong>bank transfer</strong>.
                    </p>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display      : 'block',
                            
                            
                            
                            // sizes:
                            width        : 'fit-content', // center self horizontally
                            
                            
                            
                            // backgrounds & foregrounds:
                            ...styles.theme('primary'),
                            
                            
                            
                            // borders:
                            border       : styles.borderStroke('primary'),
                            borderRadius : `${borderRadiusValues.xxl}`,
                            
                            
                            
                            // spacings:
                            marginTop    : `${spacerValues.md}`,
                            marginBottom : `${spacerValues.md}`,
                            marginLeft   : 'auto',
                            marginRight  : 'auto',
                            padding      : `calc(${spacerValues.md} * 1.5)`,
                        }}
                    >
                        <p
                            // styles:
                            style={{
                                // layouts:
                                ...styles.paragraphFirst,
                                
                                
                                
                                // spacings:
                                columnGap    : '0.5em',
                                
                                
                                
                                // typos:
                                ...styles.textBig,
                            }}
                        >
                            <span>Amount:</span>
                            <br />
                            <Order.TotalValue />
                        </p>
                        <Payment.HasExpires>
                            <p style={styles.paragraphLast}>
                                The order will be <strong>automatically canceled</strong> after:
                                <br />
                                <strong style={styles.textSemibold}>
                                    <Payment.Expires />
                                </strong>
                            </p>
                        </Payment.HasExpires>
                    </div>
                    
                    <Payment.IsManualTransfer>
                        <Payment.Bank />
                    </Payment.IsManualTransfer>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
            </article>,
        },
        rejected                   : {
            host                   : process.env.EMAIL_ADMIN_REJECTED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_ADMIN_REJECTED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_ADMIN_REJECTED_SECURE === 'true'),
            username               : process.env.EMAIL_ADMIN_REJECTED_USERNAME ?? '',
            password               : process.env.EMAIL_ADMIN_REJECTED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_ADMIN_REJECTED_FROM ?? '',
            subject                : <>
                A Payment Confirmation Has Been Rejected at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        A Payment Confirmation Has Been Rejected
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Admin.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        A payment confirmation was <strong>rejected</strong> because the information he/she submitted was invalid.
                    </p>
                    
                    <Payment.HasConfirmationRejection>
                        <p style={styles.paragraph}>
                            Rejection reason:
                            <br />
                            <Payment.ConfirmationRejection />
                        </p>
                    </Payment.HasConfirmationRejection>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Payment Method
                    </h2>
                    
                    <p style={styles.paragraph}>
                        He/she chose to pay manually via <strong>bank transfer</strong>.
                    </p>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display      : 'block',
                            
                            
                            
                            // sizes:
                            width        : 'fit-content', // center self horizontally
                            
                            
                            
                            // backgrounds & foregrounds:
                            ...styles.theme('primary'),
                            
                            
                            
                            // borders:
                            border       : styles.borderStroke('primary'),
                            borderRadius : `${borderRadiusValues.xxl}`,
                            
                            
                            
                            // spacings:
                            marginTop    : `${spacerValues.md}`,
                            marginBottom : `${spacerValues.md}`,
                            marginLeft   : 'auto',
                            marginRight  : 'auto',
                            padding      : `calc(${spacerValues.md} * 1.5)`,
                        }}
                    >
                        <p
                            // styles:
                            style={{
                                // layouts:
                                ...styles.paragraphFirst,
                                
                                
                                
                                // spacings:
                                columnGap    : '0.5em',
                                
                                
                                
                                // typos:
                                ...styles.textBig,
                            }}
                        >
                            <span>Amount:</span>
                            <br />
                            <Order.TotalValue />
                        </p>
                        <Payment.HasExpires>
                            <p style={styles.paragraphLast}>
                                The order will be <strong>automatically canceled</strong> after:
                                <br />
                                <strong style={styles.textSemibold}>
                                    <Payment.Expires />
                                </strong>
                            </p>
                        </Payment.HasExpires>
                    </div>
                    
                    <Payment.IsManualTransfer>
                        <Payment.Bank />
                    </Payment.IsManualTransfer>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
            </article>,
        },
        
        processing                 : {
            host                   : process.env.EMAIL_ADMIN_PROCESSING_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_ADMIN_PROCESSING_PORT ?? '465'),
            secure                 : (process.env.EMAIL_ADMIN_PROCESSING_SECURE === 'true'),
            username               : process.env.EMAIL_ADMIN_PROCESSING_USERNAME ?? '',
            password               : process.env.EMAIL_ADMIN_PROCESSING_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_ADMIN_PROCESSING_FROM ?? '',
            subject                : <>
                An Order Is Being Processed at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        An Order Is Being Processed!
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Admin.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        An order of <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span> is <strong>being processed</strong> by our team.
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
            </article>,
        },
        
        shipping                   : {
            host                   : process.env.EMAIL_ADMIN_SHIPPING_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_ADMIN_SHIPPING_PORT ?? '465'),
            secure                 : (process.env.EMAIL_ADMIN_SHIPPING_SECURE === 'true'),
            username               : process.env.EMAIL_ADMIN_SHIPPING_USERNAME ?? '',
            password               : process.env.EMAIL_ADMIN_SHIPPING_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_ADMIN_SHIPPING_FROM ?? '',
            subject                : <>
                A Shipping Confirmation at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        An Order Is Being Shipped!
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Admin.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        An order of <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span> is <strong>being shipped</strong>.
                    </p>
                    <p style={styles.paragraphLast}>
                        Please use the link below to track shipping status:
                        <br />
                        <Shipping.TrackingLink />
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Shipping Info
                    </h2>
                    
                    <Shipping.Info style={styles.selfCenterHorz} />
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
            </article>,
        },
        completed                  : {
            host                   : process.env.EMAIL_ADMIN_COMPLETED_HOST     ?? '',
            port                   : Number.parseInt(process.env.EMAIL_ADMIN_COMPLETED_PORT ?? '465'),
            secure                 : (process.env.EMAIL_ADMIN_COMPLETED_SECURE === 'true'),
            username               : process.env.EMAIL_ADMIN_COMPLETED_USERNAME ?? '',
            password               : process.env.EMAIL_ADMIN_COMPLETED_PASSWORD ?? '',
            
            from                   : process.env.EMAIL_ADMIN_COMPLETED_FROM ?? '',
            subject                : <>
                An Order Is Now Complete at <Business.Name />
            </>,
            message                : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        <IfPhysicalProduct>
                            An Order Has Arrived!
                        </IfPhysicalProduct>
                        <IfNotPhysicalProduct>
                            An Order Has Been Processed!
                        </IfNotPhysicalProduct>
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Admin.Name />,
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        <IfPhysicalProduct>
                            <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span> has received the order package.
                        </IfPhysicalProduct>
                        <IfNotPhysicalProduct>
                            An order of <strong><Customer.Name /></strong> <span style={styles.textSmall}>(<Customer.Email />)</span> has been fully processed.
                        </IfNotPhysicalProduct>
                        <br />
                        Now his/her order status is marked as <strong>complete</strong>.
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Order Summary
                    </h2>
                    
                    <div
                        // styles:
                        style={{
                            // positions:
                            ...styles.selfCenterHorz, // center self horizontally
                            
                            
                            
                            // layouts:
                            display : 'grid',
                            
                            
                            
                            // sizes:
                            width   : 'fit-content',
                        }}
                    >
                        <table
                            // styles:
                            style={{
                                // positions:
                                ...styles.selfCenterHorz, // center self horizontally
                                
                                
                                
                                // layouts:
                                ...styles.tableReset,
                                
                                
                                
                                // spacings:
                                marginBottom : '0.5rem',
                            }}
                        >
                            <tbody>
                                <tr>
                                    {/* label */}
                                    <td style={styles.tableLabelSide}>
                                        Order Number
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td style={styles.textBold}>
                                        <Order.Id />
                                    </td>
                                </tr>
                                <tr>
                                    {/* label */}
                                    <td  style={styles.tableLabelSide}>
                                        Order Date
                                    </td>
                                    
                                    {/* colon */}
                                    <td style={styles.tableColonSeparator}>
                                        :
                                    </td>
                                    
                                    {/* value */}
                                    <td>
                                        <Order.CreatedAt />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Items />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Subtotal />
                        <Order.Shipping />
                        
                        <hr style={styles.horzRule} />
                        
                        <Order.Total />
                    </div>
                </section>
                
                <IfPhysicalProduct>
                    <section style={styles.section}>
                        <h2 style={styles.heading2}>
                            Shipping Info
                        </h2>
                        
                        <Shipping.Info style={styles.selfCenterHorz} />
                    </section>
                </IfPhysicalProduct>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Customer Info
                    </h2>
                    
                    <Customer.Info style={styles.selfCenterHorz} />
                </section>
            </article>,
        },
    },
};
