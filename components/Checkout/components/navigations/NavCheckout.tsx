'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// redux:
import {
    useDispatch,
}                           from 'react-redux'

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    ButtonWithBusy,
}                           from '../ButtonWithBusy'

// stores:
import {
    showCart,
}                           from '@/store/features/cart/cartSlice'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const NavCheckout = (): JSX.Element|null => {
    // states:
    const {
        // states:
        checkoutStep,
        checkoutProgress,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
        gotoPayment,
    } = useCheckoutState();
    const isCheckoutFinished = (checkoutStep === 'pending') || (checkoutStep === 'paid');
    
    
    
    // stores:
    const dispatch = useDispatch();
    
    
    
    // utilities:
    const [prevAction, nextAction] = useMemo(() => {
        const prevAction = [
            { text: 'Return to cart'       , action: () => dispatch(showCart(true)) },
            { text: 'Return to information', action: () => gotoStepInformation()    },
            { text: 'Return to shipping'   , action: gotoStepShipping               },
        ][checkoutProgress];
        
        const nextAction = [
            { text: 'Continue to shipping' , action: gotoStepShipping               },
            { text: 'Continue to payment'  , action: gotoPayment                    },
        ][checkoutProgress];
        
        return [prevAction, nextAction] as const;
    }, [checkoutProgress]);
    
    
    
    // jsx:
    return (
        <>
            {!isCheckoutFinished && <>
                {!!prevAction && <ButtonIcon
                    // appearances:
                    icon='arrow_back'
                    iconPosition='start'
                    
                    
                    
                    // variants:
                    size='md'
                    theme='primary'
                    buttonStyle='link'
                    
                    
                    
                    // classes:
                    className='back'
                    
                    
                    
                    // handlers:
                    onClick={prevAction.action}
                >
                    {prevAction.text}
                </ButtonIcon>}
                
                {!!nextAction && <ButtonWithBusy
                    // components:
                    buttonComponent={
                        <ButtonIcon
                            // appearances:
                            icon='arrow_forward'
                            iconPosition='end'
                            
                            
                            
                            // variants:
                            size='lg'
                            theme='primary'
                            gradient={true}
                            
                            
                            
                            // classes:
                            className='next'
                            
                            
                            
                            // handlers:
                            onClick={nextAction.action}
                        >
                            {nextAction.text}
                        </ButtonIcon>
                    }
                />}
            </>}
            
            {isCheckoutFinished && <>
                {/* TODO: remove when the finish order completed */}
                <ButtonIcon
                    icon='arrow_back'
                    iconPosition='start'
                    
                    size='md'
                    theme='primary'
                    buttonStyle='link'
                    className='back'
                    
                    onClick={gotoPayment}
                >
                    BACK
                </ButtonIcon>
                {/* TODO: re-activate when the finish order completed */}
                {/* <p>
                    <Icon
                        // appearances:
                        icon='help'
                        
                        
                        
                        // variants:
                        size='md'
                        theme='primary'
                    />
                    Need help?
                    <Button
                        // variants:
                        theme='primary'
                        buttonStyle='link'
                    >
                        <Link href='/contact'>
                            Contact Us
                        </Link>
                    </Button>
                </p> */}
                
                <ButtonIcon
                    // appearances:
                    icon='shopping_bag'
                    iconPosition='end'
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    gradient={true}
                    
                    
                    
                    // classes:
                    className='next'
                >
                    <Link href='/products'>
                        Continue Shopping
                    </Link>
                </ButtonIcon>
            </>}
        </>
    );
};
export {
    NavCheckout,
    NavCheckout as default,
}
