export const commerceConfig = {
    EMAIL_ORDER_PAID_SUBJECT : `Your Order at ${process.env.BUSINESS_NAME || process.env.WEBSITE_URL}`,
    EMAIL_ORDER_PAID_MESSAGE : <>
        <section>
            <h1>
                Thank You For Your Order!
            </h1>
            
            <p>
                Dear {/* <Customer.Name /> */},
            </p>
            
            <p>
                Thank you for placing an order at {process.env.BUSINESS_NAME || process.env.WEBSITE_URL || 'our website'}.
                We are pleased to confirm that we have received your order:
            </p>
            
            <table>
                <tbody>
                    <tr>
                        <td>
                            Order number
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
                            Order date
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
        </section>
        
        <hr />
        
        <section>
            <h2>
                Order Summary
            </h2>
            
            {/* <ViewCart /> */}
            
            <p>
                (physical product):
                Please allow 24 hours to track your order.
            </p>
        </section>
        
        <hr />
        
        <section>
            <h2>
                Customer Information
            </h2>
            
            {/* <ViewCustomer title={null} /> */}
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
