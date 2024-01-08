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
    CheckoutConfig,
}                           from '@/components/Checkout/types'
import '@/theme.basics.config'



export const checkoutConfig : CheckoutConfig = {
    business : {
        name    : process.env.BUSINESS_NAME ?? '',
        url     : process.env.BUSINESS_URL  ?? '',
    },
    payment  : {
        bank            : <article>
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
        confirmationUrl : '/checkout/payment-confirmation',
    },
    shipping : {
        trackingUrl     : '/checkout/shipping-tracking',
    },
    emails   : {
        checkout  : {
            host     : process.env.EMAILS_CHECKOUT_HOST     ?? '',
            port     : Number.parseInt(process.env.EMAILS_CHECKOUT_PORT ?? '465'),
            secure   : (process.env.EMAILS_CHECKOUT_SECURE === 'true'),
            username : process.env.EMAILS_CHECKOUT_USERNAME ?? '',
            password : process.env.EMAILS_CHECKOUT_PASSWORD ?? '',
            
            from     : process.env.EMAILS_CHECKOUT_FROM ?? '',
            subject  : <>
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
            message  : <article style={styles.article}>
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
                        
                        <p style={styles.paragraph}>
                            Please immediately make payment for your order to <strong>one of</strong> our accounts below:
                        </p>
                        
                        <p
                            // styles:
                            style={{
                                // layouts:
                                ...styles.paragraph,
                                display   : 'flex',
                                
                                
                                
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
                                columnGap    : '0.5em',
                                
                                
                                
                                // typos:
                                ...styles.textBig,
                            }}
                        >
                            <span>Amount:</span>
                            <Order.TotalValue />
                        </p>
                        
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
        
        shipping  : {
            host     : process.env.EMAILS_SHIPPING_HOST     ?? '',
            port     : Number.parseInt(process.env.EMAILS_SHIPPING_PORT ?? '465'),
            secure   : (process.env.EMAILS_SHIPPING_SECURE === 'true'),
            username : process.env.EMAILS_SHIPPING_USERNAME ?? '',
            password : process.env.EMAILS_SHIPPING_PASSWORD ?? '',
            
            from     : process.env.EMAILS_SHIPPING_FROM ?? '',
            subject  : <>
                A Shipping Confirmation of Your Order at <Business.Name />
            </>,
            message  : <article style={styles.article}>
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
                    
                    <p style={styles.paragraphLast}>
                        Thank you for placing an order at <strong><Business.Name /></strong>.
                        <br />
                        We are pleased to confirm that your order is <strong>on its way</strong>.
                    </p>
                    <p>
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
        
        completed : {
            host     : process.env.EMAILS_COMPLETED_HOST     ?? '',
            port     : Number.parseInt(process.env.EMAILS_COMPLETED_PORT ?? '465'),
            secure   : (process.env.EMAILS_COMPLETED_SECURE === 'true'),
            username : process.env.EMAILS_COMPLETED_USERNAME ?? '',
            password : process.env.EMAILS_COMPLETED_PASSWORD ?? '',
            
            from     : process.env.EMAILS_COMPLETED_FROM ?? '',
            subject  : <>
                Your Order Status Is Now Complete
            </>,
            message  : <article style={styles.article}>
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
        
        rejected  : {
            host     : process.env.EMAILS_REJECTED_HOST     ?? '',
            port     : Number.parseInt(process.env.EMAILS_REJECTED_PORT ?? '465'),
            secure   : (process.env.EMAILS_REJECTED_SECURE === 'true'),
            username : process.env.EMAILS_REJECTED_USERNAME ?? '',
            password : process.env.EMAILS_REJECTED_PASSWORD ?? '',
            
            from     : process.env.EMAILS_REJECTED_FROM ?? '',
            subject  : <>
                Your Payment Confirmation Rejected of Your Order at <Business.Name />
            </>,
            message  : <article style={styles.article}>
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
                    
                    <p style={styles.paragraph}>
                        Reason:
                        <br />
                        <Payment.ConfirmationRejection />
                    </p>
                    
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
                    
                    <p
                        // styles:
                        style={{
                            // layouts:
                            ...styles.paragraph,
                            display   : 'flex',
                            
                            
                            
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
                            columnGap    : '0.5em',
                            
                            
                            
                            // typos:
                            ...styles.textBig,
                        }}
                    >
                        <span>Amount:</span>
                        <Order.TotalValue />
                    </p>
                    
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
};
