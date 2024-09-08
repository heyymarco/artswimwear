'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useState,
}                           from 'react'

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

import {
    utc,
}                           from 'moment'

// internals:
import {
    useEditOrderDialogStyleSheet,
}                           from './styles/loader'



export interface CountDownProps
    extends
        // bases:
        BasicProps
{
    paymentExpiresAt : Date
}
const CountDown = (props: CountDownProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditOrderDialogStyleSheet();
    
    
    
    // props:
    const {
        // resources:
        paymentExpiresAt,
        
        
        
        // other props:
        ...restCountDownProps
    } = props;
    
    
    
    // states:
    const [timeLeft, setTimeLeft] = useState<number>(() => (new Date(new Date(paymentExpiresAt)).valueOf()) - Date.now());
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        let scheculeTick : ReturnType<typeof setTimeout>;
        const tick = () => {
            const timeLeft = (new Date(new Date(paymentExpiresAt)).valueOf()) - Date.now();
            if (timeLeft <= 0) {
                setTimeLeft(0);
            }
            else {
                setTimeLeft(timeLeft);
                
                const nextTick = (timeLeft % 1000);
                scheculeTick = setTimeout(tick, nextTick);
            } // if
        };
        tick();
        
        
        
        // cleanups:
        return () => {
            clearTimeout(scheculeTick);
        };
    }, []);
    
    
    
    // default props:
    const {
        // variants:
        size     = 'sm',
        theme    = 'danger',
        outlined = true,
        nude     = true,
        
        
        
        // classes:
        className = styleSheet.countDown,
        
        
        
        // other props:
        ...restBasicProps
    } = restCountDownProps;
    
    
    
    // jsx:
    if (timeLeft <= 0) return null;
    const dayLeft = Math.floor(timeLeft.valueOf() / (24 * 60 * 60 * 1000));
    return (
        <Basic
            // other props:
            {...restBasicProps}
            
            
            
            // variants:
            size      = {size}
            theme     = {theme}
            outlined  = {outlined}
            nude      = {nude}
            
            
            
            // classes:
            className = {className}
        >
            <small>
                Order automatically canceled (expired) in:
            </small>
            <span>
                {dayLeft} {(dayLeft >= 2) ? 'days' : 'day'} and {utc(timeLeft).format('HH:mm:ss')}
            </span>
        </Basic>
    );
};
export {
    CountDown,
    CountDown as default,
}
