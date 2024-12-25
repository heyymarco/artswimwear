'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useRef,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    type GroupProps,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// cart components:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// payment components:
import {
    type PayWithSavedCardButtonProps,
    PayWithSavedCardButton,
}                           from '@/components/payments/PayWithSavedCardButton'
import {
    SavedCardCard,
}                           from '@/components/views/SavedCardCard'

// models:
import {
    type PaymentMethodDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetPaymentMethodOfCurreny,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface ConditionalCreditCardSavedButtonProps<out TElement extends Element = HTMLDivElement>
    extends
        Pick<GroupProps<TElement>,
            // refs:
            |'outerRef'       // moved to <Group>
            
            // identifiers:
            |'id'             // moved to <Group>
            
            // variants:
            |'size'           // moved to <Group>
            |'theme'          // moved to <Group>
            |'gradient'       // moved to <Group>
            |'outlined'       // moved to <Group>
            |'mild'           // moved to <Group>
            
            // classes:
            |'mainClass'      // moved to <Group>
            |'classes'        // moved to <Group>
            |'variantClasses' // moved to <Group>
            |'stateClasses'   // moved to <Group>
            |'className'      // moved to <Group>
            
            // styles:
            |'style'          // moved to <Group>
            
            // children:
            |'children' // no children allowed
        >,
        Omit<PayWithSavedCardButtonProps,
            // refs:
            |'outerRef'       // moved to <Group>
            
            // identifiers:
            |'id'             // moved to <Group>
            
            // variants:
            |'size'           // moved to <Group>
            |'theme'          // moved to <Group>
            |'gradient'       // moved to <Group>
            |'outlined'       // moved to <Group>
            |'mild'           // moved to <Group>
            
            // classes:
            |'mainClass'      // moved to <Group>
            |'classes'        // moved to <Group>
            |'variantClasses' // moved to <Group>
            |'stateClasses'   // moved to <Group>
            |'className'      // moved to <Group>
            
            // styles:
            |'style'          // moved to <Group>
            
            // data:
            |'model'          // the model is already defined internally
        >
{
}
const ConditionalCreditCardSavedButton            = <TElement extends Element = HTMLDivElement>(props: ConditionalCreditCardSavedButtonProps<TElement>): JSX.Element|null => {
    // sessions:
    const { data: session } = useSession();
    
    
    
    // jsx:
    if (!session) return null;
    return (
        <LoggedInConditionalCreditCardSavedButton<TElement> {...props} />
    );
};
const LoggedInConditionalCreditCardSavedButton    = <TElement extends Element = HTMLDivElement>(props: ConditionalCreditCardSavedButtonProps<TElement>): JSX.Element|null => {
    // states:
    const {
        // accessibilities:
        currency,
    } = useCartState();
    const {
        data    : compatiblePaymentMethods,
    } = useGetPaymentMethodOfCurreny({
        currency,
    });
    const paymentMethods = compatiblePaymentMethods;
    
    
    
    // jsx:
    if (!paymentMethods?.length) return null;
    return (
        <ImplementedConditionalCreditCardSavedButton<TElement> {...props} paymentMethods={paymentMethods as [PaymentMethodDetail, ...PaymentMethodDetail[]]} />
    );
};
const ImplementedConditionalCreditCardSavedButton = <TElement extends Element = HTMLDivElement>(props: ConditionalCreditCardSavedButtonProps<TElement> & { paymentMethods: [PaymentMethodDetail, ...PaymentMethodDetail[]] }): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,                                            // take, moved to <PayWithSavedCardButton>
        outerRef,                                          // take, moved to <Group>
        
        
        
        // identifiers:
        id,                                                // take, moved to <Group>
        
        
        
        // variants:
        size      = 'lg',                                  // take, moved to <Group>
        theme,                                             // take, moved to <Group>
        gradient,                                          // take, moved to <Group>
        outlined,                                          // take, moved to <Group>
        mild,                                              // take, moved to <Group>
        
        
        
        // classes:
        mainClass,                                         // take, moved to <Group>
        classes,                                           // take, moved to <Group>
        variantClasses,                                    // take, moved to <Group>
        stateClasses,                                      // take, moved to <Group>
        className,                                         // take, moved to <Group>
        
        
        
        // styles:
        style,                                             // take, moved to <Group>
        
        
        
        // data:
        paymentMethods,
        
        
        
        // other props:
        ...restConditionalCreditCardSavedButtonProps
    } = props;
    
    
    
    // refs:
    const outerRefInternal = useRef<TElement|null>(null);
    const mergedOuterRef   = useMergeRefs(
        // preserves the original `outerRef` from `props`:
        outerRef,
        
        
        
        outerRefInternal,
    );
    
    
    
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
        // other props:
        ...restPayWithSavedCardButtonProps
    } = restConditionalCreditCardSavedButtonProps;
    
    
    
    // jsx:
    return (
        <Group<TElement>
            // refs:
            outerRef={mergedOuterRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // variants:
            size={size}
            theme={theme}
            gradient={gradient}
            outlined={outlined}
            mild={mild}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            <PayWithSavedCardButton
                // other props:
                {...restPayWithSavedCardButtonProps}
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // data:
                model={selectedPaymentMethod}
                
                
                
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
