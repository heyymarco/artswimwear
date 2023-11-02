export const commerceConfig = {
    EMAIL_ORDER_PAID_SUBJECT : `Your Order at ${process.env.BUSINESS_NAME || process.env.WEBSITE_URL}`,
    EMAIL_ORDER_PAID_MESSAGE : <>
        <section>
            <h1>
                Thanks For Your Order!
            </h1>
            
            <p>
                Dear {/* <Customer.Name /> */},
            </p>
            
            <p>
                Thank you for placing an order at {process.env.BUSINESS_NAME || process.env.WEBSITE_URL || 'our website'}.
                We are pleased to confirm that we have received your order{<> and it is currently being processed</>}.
            </p>
        </section>
        
        <hr />
        
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
                            {/* <Order.OrderId /> */}
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
                            {/* <Order.CreatedAt /> */}
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <hr />
            
            {/* <Order.Items /> */}
            
            <hr />
            
            {/* <Order.Subtotal /> */}
            
            <hr />
            
            {/* <Order.Total /> */}
            
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
            
            {/* <Shipping.Info /> */}
        </section>
        
        <hr />
        
        <section>
            <h2>
                Payment Info
            </h2>
            
            {/* <Payment.Info /> */}
        </section>
        
        <hr />
        
        <section>
            <h2>
                Customer Info
            </h2>
            
            {/* <Customer.Info /> */}
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
