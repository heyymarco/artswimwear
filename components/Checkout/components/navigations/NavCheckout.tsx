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
    Icon,
    Button,
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
        checkoutProgress,
        
        isCheckoutFinished,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
        gotoPayment,
    } = useCheckoutState();
    
    
    
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
                <p>
                    <Icon
                        // appearances:
                        icon='help'
                        
                        
                        
                        // variants:
                        size='md'
                    />
                    {' '}Need help?{' '}
                    <Button
                        // variants:
                        buttonStyle='link'
                    >
                        <Link href='/contact'>
                            Contact Us
                        </Link>
                    </Button>
                </p>
                
                <ButtonIcon
                    // appearances:
                    icon='shopping_bag'
                    iconPosition='end'
                    
                    
                    
                    // variants:
                    size='lg'
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
