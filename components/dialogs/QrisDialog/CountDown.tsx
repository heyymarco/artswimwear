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



// react components:
export interface CountDownProps
    extends
        // bases:
        BasicProps
{
    // resources:
    expires   : Date
    
    
    
    // handlers:
    onTimeOut : () => void
}
const CountDown = (props: CountDownProps) => {
    // props:
    const {
        // resources:
        expires,
        
        
        
        // handlers:
        onTimeOut,
        
        
        
        // other props:
        ...restCountDownProps
    } = props;
    
    
    
    // states:
    const [timeLeft, setTimeLeft] = useState<number>(() => expires.valueOf() - Date.now());
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        let scheculeTick : ReturnType<typeof setTimeout>;
        const tick = () => {
            const timeLeft = expires.valueOf() - Date.now();
            if (timeLeft <= 0) {
                setTimeLeft(0);
                onTimeOut();
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
        theme    = (timeLeft >= (30 * 1000)) ? 'primary' : 'danger',
        outlined = true,
        nude     = true,
        
        
        
        // other props:
        ...restBasicProps
    } = restCountDownProps;
    
    
    
    // jsx:
    return (
        <Basic
            // other props:
            {...restBasicProps}
            
            
            
            // variants:
            size     = {size}
            theme    = {theme}
            outlined = {outlined}
            nude     = {nude}
        >
            {utc(timeLeft).format('HH:mm:ss')}
        </Basic>
    );
};
export {
    CountDown,
    CountDown as default,
}
