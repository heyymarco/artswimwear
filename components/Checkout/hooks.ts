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
    field    : TField
    
    state    : CheckoutState
    dispatch : (value: TValue) => {
        payload : TValue
        type    : string
    }
}
export type FieldHandlers<TElement extends HTMLInputElement = HTMLInputElement> = Required<Pick<React.InputHTMLAttributes<TElement>, 'onChange'>>
export const useFieldState = <TField extends keyof CheckoutState, TValue extends CheckoutState[TField], TElement extends HTMLInputElement = HTMLInputElement>(options: FieldStateOptions<TField, TValue>): readonly [TValue, React.Dispatch<React.SetStateAction<TValue>>, FieldHandlers<TElement>] => {
    // stores:
    const field : TValue = options.state[options.field] as TValue;
    const dispatch = useDispatch();
    
    
    
    // handlers:
    const handleSetField    = useEvent<React.Dispatch<React.SetStateAction<TValue>>>((value) => {
        dispatch(
            options.dispatch(
                (typeof(value) === 'function')
                ? value(field)
                : value
            )
        );
    })
    const handleFieldChange = useEvent<React.ChangeEventHandler<TElement>>((event) => {
        handleSetField(
            ((event.target.type === 'checkbox') || (event.target.type === 'radio'))
            ? event.target.checked as TValue
            : event.target.value   as TValue
        );
    });
    
    
    
    // api:
    return [
        field,
        handleSetField,
        useMemo(() => ({ // make a stable ref object
            onChange : handleFieldChange,
        }), []),
    ];
};
