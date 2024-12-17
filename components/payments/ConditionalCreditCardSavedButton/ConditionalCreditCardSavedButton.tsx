'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui components:
import {
    // simple-components:
    Button,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    type GroupProps,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    PayWithSavedCardButton,
}                           from './PayWithSavedCardButton'

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
                    Pay with
                </>}
            >
                {paymentMethods.map(({identifier}, index) =>
                    <ListItem key={index}>
                        {identifier}
                    </ListItem>
                )}
            </DropdownListButton>
        </Group>
    );
};
export {
    ConditionalCreditCardSavedButton,
    ConditionalCreditCardSavedButton as default,
};
