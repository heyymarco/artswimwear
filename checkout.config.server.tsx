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
    EMAIL_CHECKOUT_MESSAGE : <article
        style={{
            color: 'initial',
        }}
    >
        <section>
            <h1>
                Thanks For Your Order!
            </h1>
            
            <p>
                Dear <Customer.Name />,
            </p>
            
            <p>
                Thank you for placing an order on {process.env.BUSINESS_NAME || process.env.WEBSITE_URL || 'our website'}.
                We are pleased to confirm that we have received your order<IfPaid> and it is <strong>currently being processed</strong></IfPaid><IfNotPaid> and are <strong>waiting for your payment</strong> so that your order can be processed further</IfNotPaid>.
            </p>
        </section>
        
        <IfNotPaid>
            <hr />
            
            <section>
                <h2>
                    Payment Instruction
                </h2>
                
                <p>
                    TODO: write a transfer instruction here.
                </p>
            </section>
        </IfNotPaid>
        
        <hr />
        
        <section>
            <h2>
                Order Summary
            </h2>
            
            <div
                // styles:
                style={{
                    // sizes:
                    // inlineSize: 'fit-content', // not supported by GMail
                    width: 'fit-content',
                    
                    
                    
                    // typos:
                    color: 'initial',
                }}
            >
                <table
                    // styles:
                    style={{
                        // layouts:
                        tableLayout: 'auto',
                        
                        
                        
                        // borders:
                        borderCollapse: 'collapse',
                        
                        
                        
                        // spacings:
                        // marginBlockEnd : '1rem', // not supported by GMail
                        marginBottom   : '1rem',
                    }}
                >
                    <tbody>
                        <tr>
                            <td
                                // styles:
                                style={{
                                    // appearances:
                                    opacity : 0.6,
                                }}
                            >
                                Order Number
                            </td>
                            <td
                                // styles:
                                style={{
                                    // appearances:
                                    opacity : 0.6,
                                    
                                    
                                    
                                    // spacings:
                                    paddingLeft  : '0.5em',
                                    paddingRight : '0.5em',
                                }}
                            >
                                :
                            </td>
                            <td>
                                <Order.Id />
                            </td>
                        </tr>
                        <tr>
                            <td
                                // styles:
                                style={{
                                    // appearances:
                                    opacity : 0.6,
                                }}
                            >
                                Order Date
                            </td>
                            <td
                                // styles:
                                style={{
                                    // appearances:
                                    opacity : 0.6,
                                    
                                    
                                    
                                    // spacings:
                                    paddingLeft  : '0.5em',
                                    paddingRight : '0.5em',
                                }}
                            >
                                :
                            </td>
                            <td>
                                <Order.CreatedAt />
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <hr />
                
                <Order.Items />
                
                <hr />
                
                <Order.Subtotal />
                <br />
                <Order.Shipping />
                
                <hr />
                
                <Order.Total />
                
                <IfPhysicalProduct>
                    <hr />
                </IfPhysicalProduct>
            </div>
            
            <IfPhysicalProduct>
                <p>
                    We will send you another shipping confirmation email as soon as your order has been dispatched from our warehouse.
                </p>
            </IfPhysicalProduct>
        </section>
        
        <hr />
        
        <section>
            <h2>
                Shipping Info
            </h2>
            
            <Shipping.Info title={null} />
        </section>
        
        <IfPaid>
            <hr />
            
            <section>
                <h2>
                    Payment Info
                </h2>
                
                <Payment.Info title={null} />
            </section>
        </IfPaid>
        
        <hr />
        
        <section>
            <h2>
                Customer Info
            </h2>
            
            <Customer.Info title={null} />
        </section>
        
        <hr />
        
        <section>
            <h2>
                Customer Care Support
            </h2>
            
            <p>
                Need help? Please reply this email.
            </p>
        </section>
    </article>
};
