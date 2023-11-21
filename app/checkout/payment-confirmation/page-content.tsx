'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
}                           from 'react'

// next-js:
import {
    // navigations:
    useSearchParams,
}                           from 'next/navigation'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // notification-components:
    Alert,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
    Main,
}                           from '@heymarco/section'

// internal components:
import {
    LoadingBlankPage,
    ErrorBlankPage,
}                           from '@/components/BlankPage'

// stores:
import {
    // hooks:
    usePaymentConfirmation,
}                           from '@/store/features/api/apiSlice'



// styles:
const usePaymentConfirmationPageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./page-styles')
, { id: 'ztb0mar5a4' });
import './page-styles';



// react components:
export function PaymentConfirmationPageContent(): JSX.Element|null {
    // styles:
    const styleSheet = usePaymentConfirmationPageStyleSheet();
    
    
    
    // navigations:
    const searchParams = useSearchParams();
    
    
    
    // states:
    const [token] = useState<string>(() => searchParams.get('token') ?? '');
    
    
    
    // apis:
    const [paymentConfirmation, {data: paymentConfirmationData, isLoading: isPaymentConfirmationLoading, isError: isPaymentConfirmationError, error: paymentConfirmationError}] = usePaymentConfirmation();
    
    const isPageLoading = isPaymentConfirmationLoading;
    const hasData       = (!!paymentConfirmationData);
    const isPageError   = (!isPageLoading && (isPaymentConfirmationError)) || (!hasData && !!token) /* considered as error if no data but has token*/;
    const isPageReady   = !isPageLoading && !isPageError && !!token;
    
    
    
    // handlers:
    const handleGetConfirmationStatus = useEvent(() => {
        // conditions:
        if (!token) return; // token is blank => abort
        
        
        
        // actions:
        paymentConfirmation({
            paymentConfirmation : {
                token,
            },
        });
    });
    
    
    
    // dom effects:
    const hasInitialRefreshRef = useRef<boolean>(false); // ensures the payment confirmation token not re-refreshed twice (especially in dev mode)
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (hasInitialRefreshRef.current) return; // already scheduled => ignore the twice_dev_mode
        hasInitialRefreshRef.current = true;
        
        
        
        // actions:
        handleGetConfirmationStatus();
    }, [token]);
    
    
    
    // jsx:
    if (isPageLoading) return (
        <LoadingBlankPage
            // identifiers:
            key='busy' // avoids re-creating a similar dom during loading transition in different components
        />
    );
    if (isPageError && ((paymentConfirmationError as any)?.status !== 400)) return ( // display error other than 400 (bad payment confirmation token)
        <ErrorBlankPage
            // handlers:
            onRetry={handleGetConfirmationStatus}
        />
    );
    return (
        <Main
            // classes:
            className={styleSheet.main}
        >
            <Section title='Payment Confirmation'>
                {!isPageReady && <Alert
                    // variants:
                    theme='danger'
                    
                    
                    
                    // states:
                    expanded={true}
                    
                    
                    
                    // components:
                    controlComponent={<React.Fragment />}
                >
                    <p>
                        This payment confirmation link is invalid or expired.
                    </p>
                </Alert>}
                {!!isPageReady && <>
                    {JSON.stringify(paymentConfirmationData)}
                </>}
            </Section>
        </Main>
    );
}
