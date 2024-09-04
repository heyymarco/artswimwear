'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

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

// contexts:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const NavCheckout = (): JSX.Element|null => {
    // states:
    const {
        showCart,
    } = useCartState();
    
    const {
        // states:
        checkoutStep,
        checkoutProgress,
        
        isCheckoutFinished,
        
        
        
        // shipping data:
        isShippingAddressRequired,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
        gotoPayment,
    } = useCheckoutState();
    
    
    
    // sessions:
    const { status: sessionStatus } = useSession();
    
    
    
    // utilities:
    const [prevAction, nextAction] = useMemo(() => {
        const prevAction = [
            { text: 'Return to Cart'       , action: () => showCart()            },
            { text: 'Return to Information', action: () => gotoStepInformation() },
            { text: 'Return to Shipping'   , action: gotoStepShipping            },
        ][Math.max(0, checkoutProgress - (isShippingAddressRequired ? 0 : 1))];
        
        const nextAction = [
            { text: 'Continue to Shipping' , action: gotoStepShipping               },
            { text: 'Continue to Payment'  , action: gotoPayment                    },
        ][checkoutProgress + (isShippingAddressRequired ? 0 : 1)];
        
        return [prevAction, nextAction] as const;
    }, [checkoutProgress, isShippingAddressRequired]);
    
    
    
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
                            
                            
                            
                            // states:
                            enabled={
                                (checkoutStep !== 'INFO')
                                ||
                                (sessionStatus !== 'loading') // when on INFO step, disables the next button if the auth is still loading, because it's ambigous between using guest or customer account
                            }
                            
                            
                            
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
