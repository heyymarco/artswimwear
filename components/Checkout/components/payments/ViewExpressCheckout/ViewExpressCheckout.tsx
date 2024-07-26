'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // status-components:
    Busy,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    MessageError,
}                           from '@/components/MessageError'

// stripe:
import {
    type StripeExpressCheckoutElementOptions,
    type StripeExpressCheckoutElementReadyEvent,
    type StripeExpressCheckoutElementConfirmEvent,
}                           from '@stripe/stripe-js'
import {
    ExpressCheckoutElement,
}                           from '@stripe/react-stripe-js'

// styles:
import {
    useViewExpressCheckoutStyleSheet,
}                           from './styles/loader'



// react components:
export type ViewExpressCheckoutType =
    |'googlePay'
    |'applePay'
    |'amazonPay'
    |'paypal'
    |'link'
export interface ViewExpressCheckoutProps {
    // options:
    type        : ViewExpressCheckoutType
    buttonName  : string
    websiteName : string
}
const ViewExpressCheckout = (props: ViewExpressCheckoutProps): JSX.Element|null => {
    // props:
    const {
        // options:
        type,
        buttonName,
        websiteName,
    } = props;
    
    
    
    // styles:
    const styleSheet = useViewExpressCheckoutStyleSheet();
    
    
    
    // options:
    const options = useMemo<StripeExpressCheckoutElementOptions>(() => ({
        paymentMethods : {
            // reset:
            googlePay : 'never',
            applePay  : 'never',
            amazonPay : 'never',
            link      : 'never',
            paypal    : 'never',
            demoPay   : 'never',
            aliPay    : 'never',
            
            // set:
            [type]    : 'auto',
        },
        layout : {
            maxRows    : 0,
            maxColumns : 1,
            overflow   : 'never',
        },
    }), [type]);
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        NotAvailable,
        FullyLoaded,
    }
    const [isLoaded  , setIsLoaded  ] = useState<LoadedState>(LoadedState.Loading);
    const [generation, setGeneration] = useState<number>(1);
    
    
    
    // handlers:
    const handleLoaded    = useEvent((event: StripeExpressCheckoutElementReadyEvent) => {
        const availablePaymentMethods = event.availablePaymentMethods;
        setIsLoaded(
            (!!availablePaymentMethods && (Object.entries(availablePaymentMethods).filter(([, enabled]) => !!enabled).length === 1))
            ? LoadedState.FullyLoaded
            : LoadedState.NotAvailable
        );
    });
    const handleErrored   = useEvent((): void => {
        // actions:
        setIsLoaded(LoadedState.Errored);
    });
    const handleReload    = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
        setGeneration((current) => (current + 1));
    });
    const handleConfirmed = useEvent((event: StripeExpressCheckoutElementConfirmEvent): any => {
        // TODO: implement this...
    });
    
    
    
    // jsx:
    const isErrored      = (isLoaded === LoadedState.Errored);
    const isLoading      = !isErrored &&                                  (isLoaded === LoadedState.Loading     );
    const isNotAvailable = !isErrored && !isLoading &&                    (isLoaded === LoadedState.NotAvailable);
    const isReady        = !isErrored && !isLoading && !isNotAvailable && (isLoaded === LoadedState.FullyLoaded );
    return (
        <div
            // classes:
            className={styleSheet.main}
        >
            <div className={`${styleSheet.expressCheckout} ${isReady ? '' : 'hidden'}`}>
                <p>
                    Click the {buttonName} button below. You will be redirected to the {websiteName}&apos;s website to complete the payment.
                </p>
                
                <ExpressCheckoutElement
                    // identifiers:
                    key={generation}
                    
                    
                    
                    // options:
                    options={options}
                    
                    
                    
                    // handlers:
                    onReady={handleLoaded}
                    onLoadError={handleErrored}
                    
                    onConfirm={handleConfirmed}
                />
            </div>
            
            <p className={`${styleSheet.notAvailable} ${isNotAvailable ? '' : 'hidden'}`}>
                Sorry, this payment method is <strong>not available</strong>.
                <br />
                Please choose another payment method.
            </p>
            
            <Content theme='danger' className={`${styleSheet.error} ${isErrored ? '' : 'hidden'}`}>
                <MessageError message={null} onRetry={handleReload} />
            </Content>
            
            <Busy
                // classes:
                className={styleSheet.loading}
                
                
                
                // variants:
                size='lg'
                theme='primary'
                
                
                
                // states:
                expanded={isLoading}
            />
        </div>
    );
};
export {
    ViewExpressCheckout,
    ViewExpressCheckout as default,
};
