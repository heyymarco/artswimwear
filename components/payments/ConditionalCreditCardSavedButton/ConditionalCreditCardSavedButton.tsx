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
    // simple-components:
    Label,
    
    
    
    // layout-components:
    ListItem,
    
    
    
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
    // default props:
    const {
        // data:
        paymentMethods,
        
        
        
        // other props:
        ...restGroupProps
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
    
    
    
    // jsx:
    return (
        <Group
            // other props:
            {...restGroupProps}
            
            
            
            // variants:
            size='lg'
        >
            <PayWithSavedCardButton
                // data:
                model={selectedPaymentMethod}
                
                
                
                // classes:
                className='fluid'
            />
            <DropdownListButton
                // variants:
                size='md'
                theme='primary'
                
                
                
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
            </DropdownListButton>
        </Group>
    );
};
export {
    ConditionalCreditCardSavedButton,
    ConditionalCreditCardSavedButton as default,
};
