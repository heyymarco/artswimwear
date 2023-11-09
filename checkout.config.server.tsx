// styles:
import * as styles          from '@/components/Checkout/templates/styles'

// reusable-ui core:
import {
    // a border (stroke) management system:
    borderRadiusValues,
    
    
    
    // a spacer (gap) management system
    spacerValues,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// templates:
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
    IfNotPaid,
}                           from '@/components/Checkout/templates/IfNotPaid'
import {
    // react components:
    IfPhysicalProduct,
}                           from '@/components/Checkout/templates/IfPhysicalProduct'

// configs:
import type {
    CheckoutConfig,
}                           from '@/app/api/payments/types'
import '@/theme.config'



export const checkoutConfig : CheckoutConfig = {
    business : {
        name    : process.env.BUSINESS_NAME ?? '',
        url     : process.env.BUSINESS_URL  ?? '',
        payment : <article>
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
                        <tr style={styles.tableRowSeparator}>
                            <th style={styles.tableTitleSide}>
                                Account
                            </th>
                            <td style={styles.tableContentSide}>
                                123456789
                            </td>
                        </tr>
                        
                        <tr>
                            <th style={styles.tableTitleSide}>
                                Name of
                            </th>
                            <td style={styles.tableContentSide}>
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
                        <tr style={styles.tableRowSeparator}>
                            <th style={styles.tableTitleSide}>
                                Account
                            </th>
                            <td style={styles.tableContentSide}>
                                ABCDEFG
                            </td>
                        </tr>
                        
                        <tr>
                            <th style={styles.tableTitleSide}>
                                Name of
                            </th>
                            <td style={styles.tableContentSide}>
                                John Smith
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td></tr></tbody></table>
        </article>
    },
    emails : {
        checkout : {
            host     : process.env.EMAILS_CHECKOUT_HOST     ?? '',
            port     : Number.parseInt(process.env.EMAILS_CHECKOUT_PORT ?? '465'),
            secure   : (process.env.EMAILS_CHECKOUT_SECURE === 'true'),
            username : process.env.EMAILS_CHECKOUT_USERNAME ?? '',
            password : process.env.EMAILS_CHECKOUT_PASSWORD ?? '',
            
            from     : process.env.EMAILS_CHECKOUT_FROM ?? '',
            subject  : <><IfNotPaid>Awaiting Payment For </IfNotPaid>Your Order at <Business.Name /></>,
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
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        <IfPaid>Thanks</IfPaid><IfNotPaid>Awaiting Payment</IfNotPaid>{' '}For Your Order<IfPaid>!</IfPaid><IfNotPaid>...</IfNotPaid>
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <Customer.Name />,
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        Thank you for placing an order on <strong><Business.Name /></strong>.
                        <br />
                        We are pleased to confirm that we have received your order<IfPaid> and it is <strong>currently being processed</strong></IfPaid><IfNotPaid> and are <strong>waiting for your payment</strong> so that your order can be processed further</IfNotPaid>.
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
                        
                        <Business.Payment />
                        
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
                                borderRadius : `${borderRadiusValues.xxl}`,
                                
                                
                                
                                // spacings:
                                padding      : `calc(${spacerValues.md} * 1.5)`,
                            }}
                        >
                            After you make payment, please confirm your payment via this link:
                            <br />
                            <Business.Url />/payment-confirmation?orderId=<Order.Id />
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
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Shipping Info
                    </h2>
                    
                    <Shipping.Info style={styles.selfCenterHorz} />
                </section>
                
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
    },
};
