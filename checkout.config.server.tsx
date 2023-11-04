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



export const checkoutConfig = {
    EMAIL_CHECKOUT_SUBJECT : `Your Order at ${process.env.BUSINESS_NAME || process.env.WEBSITE_URL}`,
    EMAIL_CHECKOUT_MESSAGE : <>
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
        
        <hr />
        
        <IfNotPaid>
            <section>
                <h2>
                    Payment Instruction
                </h2>
                
                <p>
                    TODO: write the transfer instruction here.
                </p>
            </section>
            
            <hr />
        </IfNotPaid>
        
        <section>
            <h2>
                Order Summary
            </h2>
            
            <table>
                <tbody>
                    <tr>
                        <td>
                            Order Number
                        </td>
                        <td>
                            :
                        </td>
                        <td>
                            <Order.Id />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Order Date
                        </td>
                        <td>
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
            
            <hr />
            
            <Order.Total />
            
            <hr />
            
            <p>
                (physical product):
                We will send you another shipping confirmation email as soon as your order has been dispatched from our warehouse.
            </p>
        </section>
        
        <hr />
        
        <section>
            <h2>
                Shipping Info
            </h2>
            
            <Shipping.Info />
        </section>
        
        <hr />
        
        <IfPaid>
            <section>
                <h2>
                    Payment Info
                </h2>
                
                <Payment.Info />
            </section>
            
            <hr />
        </IfPaid>
        
        <section>
            <h2>
                Customer Info
            </h2>
            
            <Customer.Info />
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
    </>
};
