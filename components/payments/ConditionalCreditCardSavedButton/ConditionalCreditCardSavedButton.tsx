'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui components:
import {
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    type GroupProps,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// payment components:
import {
    PayWithSavedCardButton,
}                           from '@/components/payments/PayWithSavedCardButton'
import {
    SavedCardCard,
}                           from '@/components/views/SavedCardCard'

// models:
import {
    type PaymentMethodDetail,
    paymentMethodLimitMax,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetPaymentMethodPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface ConditionalCreditCardSavedButtonProps
    extends
        Omit<GroupProps,
            // children:
            |'children'
        >
{
    // states:
    isBusy ?: boolean
}
const ConditionalCreditCardSavedButton = (props: ConditionalCreditCardSavedButtonProps): JSX.Element|null => {
    // sessions:
    const { data: session } = useSession();
    
    
    
    // jsx:
    if (!session) return null;
    return (
        <LoggedInConditionalCreditCardSavedButton {...props} />
    );
};
const LoggedInConditionalCreditCardSavedButton = (props: ConditionalCreditCardSavedButtonProps): JSX.Element|null => {
    // states:
    const {
        data    : paymentMethodPagination,
    } = useGetPaymentMethodPage({
        page    : 0, // show the first page (zero_based index)
        perPage : paymentMethodLimitMax, // show all items at one page
    });
    const paymentMethods = paymentMethodPagination?.entities;
    
    
    
    // jsx:
    if (!paymentMethods?.length) return null;
    return (
        <ImplementedConditionalCreditCardSavedButton {...props} paymentMethods={paymentMethods as [PaymentMethodDetail, ...PaymentMethodDetail[]]} />
    );
};
const ImplementedConditionalCreditCardSavedButton = (props: ConditionalCreditCardSavedButtonProps & { paymentMethods: [PaymentMethodDetail, ...PaymentMethodDetail[]] }): JSX.Element|null => {
    // props:
    const {
        // data:
        paymentMethods,
        
        
        
        // states:
        isBusy = false,
        
        
        
        // other props:
        ...restConditionalCreditCardSavedButtonProps
    } = props;
    
    
    
    // states:
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDetail>(() => paymentMethods[0]);
    const selectedPaymentMethodId = selectedPaymentMethod.id;
    
    
    
    // effects:
    // resets `selectedPaymentMethod` to primary payment method if the `selectedPaymentMethod` not listed in `paymentMethods`:
    useEffect(() => {
        if (!paymentMethods.some(({id}) => (id === selectedPaymentMethodId))) {
            setSelectedPaymentMethod(paymentMethods[0]);
        } // if
    }, [paymentMethods, selectedPaymentMethodId]);
    
    
    
    // default props:
    const {
        // variants:
        size = 'lg',
        
        
        
        // other props:
        ...restGroupProps
    } = restConditionalCreditCardSavedButtonProps;
    
    
    
    // jsx:
    return (
        <Group
            // other props:
            {...restGroupProps}
            
            
            
            // variants:
            size={size}
        >
            <PayWithSavedCardButton
                // data:
                model={selectedPaymentMethod}
                
                
                
                // appearances:
                icon={isBusy ? 'busy' : undefined}
                
                
                
                // classes:
                className='fluid'
            />
            {(paymentMethods.length > 1) && <DropdownListButton
                // variants:
                size='md'
                theme='primary'
                // buttonOrientation='block'
                
                
                
                // classes:
                className='solid'
                
                
                
                // floatable:
                floatingPlacement='bottom-end'
                
                
                
                // children:
                buttonChildren={<>
                    Or select
                </>}
            >
                {paymentMethods.map((modelOption, index) =>
                    <SavedCardCard
                        // identifiers:
                        key={index}
                        
                        
                        
                        // data:
                        model={modelOption}
                        
                        
                        
                        // states:
                        active={(modelOption.id === selectedPaymentMethodId)}
                        
                        
                        
                        // handlers:
                        onClick={() => setSelectedPaymentMethod(modelOption)}
                    />
                )}
            </DropdownListButton>}
        </Group>
    );
};
export {
    ConditionalCreditCardSavedButton,
    ConditionalCreditCardSavedButton as default,
};
