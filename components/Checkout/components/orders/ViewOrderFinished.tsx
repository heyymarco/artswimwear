'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // notification-components:
    Alert,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    ViewCustomerInfo,
}                           from '../informations/ViewCustomerInfo'
import {
    ViewShippingInfo,
}                           from '../informations/ViewShippingInfo'
import {
    ViewPaymentInfo,
}                           from '../informations/ViewPaymentInfo'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
export interface ViewOrderFinishedProps {
    // data:
    paid   : boolean
}
const ViewOrderFinished = (props: ViewOrderFinishedProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        paid,
    } = props;
    
    
    
    // states:
    const {
        // states:
        isCheckoutFinished,
        
        
        
        // customer data:
        customerNickName,
        customerEmail,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <>
            <Section>
                <p>
                    Dear {customerNickName},
                </p>
                
                <p>
                    Thank you for placing an order on {process.env.BUSINESS_NAME || process.env.WEBSITE_URL || 'our website'}.
                    We are pleased to confirm that we have received your order{paid && <> and it is <strong>currently being processed</strong></>}{!paid && <> and are <strong>waiting for your payment</strong> so that your order can be processed further</>}.
                </p>
                
                <Alert
                    // variants:
                    theme='success'
                    
                    
                    
                    // states:
                    expanded={true}
                    
                    
                    
                    // components:
                    controlComponent={<React.Fragment />}
                >
                    <p>
                        {paid && <>
                            We have sent an order confirmation to your email:
                            <br />
                            <strong className={styleSheet.data}>{customerEmail}</strong>
                        </>}
                        {!paid && <>
                            Please <strong>follow the payment instructions</strong> sent to your email: <strong className={styleSheet.data}>{customerEmail}</strong>.
                        </>}
                        <br />
                        If the email has not been received, please wait a few more moments.
                    </p>
                </Alert>
            </Section>
            
            <Section
                // semantics:
                tag='aside'
                
                
                
                // classes:
                className={styleSheet.info}
            >
                <ViewCustomerInfo
                    // accessibilities:
                    readOnly={isCheckoutFinished}
                />
                
                <ViewShippingInfo
                    // accessibilities:
                    readOnly={isCheckoutFinished}
                />
                
                <ViewPaymentInfo />
            </Section>
        </>
    );
};
export {
    ViewOrderFinished,
    ViewOrderFinished as default,
};
