'use client'

// react:
import {
    // hooks:
    useMemo,
}                           from 'react'

// redux:
import {
    useDispatch,
}                           from 'react-redux'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// stores:
import type {
    // types:
    CheckoutState,
}                           from '@/store/features/checkout/checkoutSlice'



export interface FieldStateOptions<TField extends keyof CheckoutState, TValue extends CheckoutState[TField]> {
    state : CheckoutState
    
    get   : TField
    set   : (newValue: TValue) => {
        payload : TValue
        type    : string
    }
}
export type FieldHandlers<TElement extends HTMLInputElement = HTMLInputElement> = Required<Pick<React.InputHTMLAttributes<TElement>, 'onChange'>>
export const useFieldState = <TField extends keyof CheckoutState, TValue extends CheckoutState[TField], TElement extends HTMLInputElement = HTMLInputElement>(options: FieldStateOptions<TField, TValue>): readonly [TValue, React.Dispatch<React.SetStateAction<TValue>>, FieldHandlers<TElement>] => {
    // stores:
    const value    : TValue = options.state[options.get] as TValue;
    const dispatch = useDispatch();
    
    
    
    // handlers:
    const handleSetValue    = useEvent<React.Dispatch<React.SetStateAction<TValue>>>((newValue) => {
        dispatch(
            options.set(
                (typeof(newValue) === 'function')
                ? (newValue as ((oldValue: TValue) => TValue))(value)
                : newValue
            )
        );
    })
    const handleValueChange = useEvent<React.ChangeEventHandler<TElement>>((event) => {
        handleSetValue(
            ((event.target.type === 'checkbox') || (event.target.type === 'radio'))
            ? event.target.checked as TValue
            : event.target.value   as TValue
        );
    });
    
    
    
    // api:
    return [
        value,
        handleSetValue,
        useMemo(() => ({ // make a stable ref object
            onChange : handleValueChange,
        }), []),
    ];
};
