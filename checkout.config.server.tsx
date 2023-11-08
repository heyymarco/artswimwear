// styles:
import * as styles          from '@/components/Checkout/templates/styles'

// reusable-ui core:
import {
    // a color management system:
    colorValues,
    
    
    
    // a border (stroke) management system:
    borderRadiusValues,
    
    
    
    // a spacer (gap) management system
    spacerValues,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

import {
    // base-components:
    basicValues,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// templates:
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

// other libs:
import Color                from 'color'                // color utilities

// configs:
import '@/theme.config'



export const checkoutConfig = {
    EMAIL_CHECKOUT_SUBJECT : <>Your Order at {process.env.BUSINESS_NAME || process.env.WEBSITE_URL}</>,
    EMAIL_CHECKOUT_MESSAGE : <article style={styles.article}>
        <div style={styles.sectionDummy}></div>
        <section
            // styles:
            style={{
                // layouts:
                ...styles.sectionBase,
                
                
                
                // backgrounds:
                background          : (basicValues.backgGrad as any)?.[0]?.[0],
                backgroundBlendMode : `${basicValues.backgroundBlendMode}`,
                backgroundColor     : colorValues.primary.mix(Color('#ffffff')).toString().toLowerCase(),
                
                
                
                // foregrounds:
                color               : colorValues.primaryBold.toString().toLowerCase(),
                
                
                
                // borders:
                borderRadius        : `${borderRadiusValues.xxl}`,
                
                
                
                // spacings:
                margin              : `${spacerValues.md}`,
                padding             : `calc(${spacerValues.md} * 1.5)`,
            }}
        >
            <h1 style={styles.heading1}>
                Thanks For Your Order!
            </h1>
            
            <p style={styles.paragraph}>
                Dear <Customer.Name />,
            </p>
            
            <p style={styles.paragraphLast}>
                Thank you for placing an order on {process.env.BUSINESS_NAME || process.env.WEBSITE_URL || 'our website'}.
                <br />
                We are pleased to confirm that we have received your order<IfPaid> and it is <strong>currently being processed</strong></IfPaid><IfNotPaid> and are <strong>waiting for your payment</strong> so that your order can be processed further</IfNotPaid>.
            </p>
        </section>
        
        <IfNotPaid>
            <section style={styles.section}>
                <h2 style={styles.heading2}>
                    Payment Instruction
                </h2>
                
                <p style={styles.paragraphLast}>
                    TODO: write a transfer instruction here.
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
                            <td style={styles.tableLabelSide}>
                                Order Number
                            </td>
                            <td style={styles.tableColonSeparator}>
                                :
                            </td>
                            <td style={styles.textBold}>
                                <Order.Id />
                            </td>
                        </tr>
                        <tr>
                            <td  style={styles.tableLabelSide}>
                                Order Date
                            </td>
                            <td style={styles.tableColonSeparator}>
                                :
                            </td>
                            <td>
                                <Order.CreatedAt />
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <hr style={styles.borderHorz} />
                
                <Order.Items />
                
                <hr style={styles.borderHorz} />
                
                <Order.Subtotal />
                <Order.Shipping />
                
                <hr style={styles.borderHorz} />
                
                <Order.Total />
                
                <IfPhysicalProduct>
                    <hr style={styles.borderHorz} />
                </IfPhysicalProduct>
            </div>
            
            <IfPhysicalProduct>
                <p style={styles.paragraphLast}>
                    We will send you another shipping confirmation email as soon as your order has been dispatched from our warehouse.
                </p>
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
    </article>
};
