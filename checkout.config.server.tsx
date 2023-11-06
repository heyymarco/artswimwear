// styles:
import * as styles          from '@/components/Checkout/templates/styles'

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



export const checkoutConfig = {
    EMAIL_CHECKOUT_SUBJECT : <>Your Order at {process.env.BUSINESS_NAME || process.env.WEBSITE_URL}</>,
    EMAIL_CHECKOUT_MESSAGE : <article style={styles.article}>
        <section style={styles.section}>
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
                        justifySelf  : 'center',
                        
                        
                        
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
                            <td style={styles.colonSeparator}>
                                :
                            </td>
                            <td style={styles.boldText}>
                                <Order.Id />
                            </td>
                        </tr>
                        <tr>
                            <td  style={styles.tableLabelSide}>
                                Order Date
                            </td>
                            <td style={styles.colonSeparator}>
                                :
                            </td>
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
                    <hr style={styles.horzRule} />
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
            
            <Shipping.Info title={null} />
        </section>
        
        <IfPaid>
            <section style={styles.section}>
                <h2 style={styles.heading2}>
                    Payment Info
                </h2>
                
                <Payment.Info title={null} />
            </section>
        </IfPaid>
        
        <section style={styles.section}>
            <h2 style={styles.heading2}>
                Customer Info
            </h2>
            
            <Customer.Info title={null} />
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
