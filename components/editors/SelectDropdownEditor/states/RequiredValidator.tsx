// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
    
    
    
    // utilities:
    startTransition,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useTriggerRender,
    useEvent,
    EventHandler,
    
    
    
    // a validation management system:
    Result as ValResult,
    
    
    
    // a possibility of UI having an invalid state:
    ValidityChangeEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

import {
    type EditorChangeEventHandler
}                           from '@/components/editors/Editor'



// hooks:

// states:

//#region RequiredValidator
export type CustomValidatorHandler = (isValid: ValResult) => ValResult

const isSelectValid = <TValue extends unknown>(required: boolean, value: TValue): ValResult => {
    if (required && ((value === undefined) || (value === null) || (value === ''))) return false;  // required & blank value => invalid
    return true; // valid
};

export interface RequiredValidatorProps {
    // validations:
    required        ?: boolean
    customValidator ?: CustomValidatorHandler
}
export interface RequiredValidatorApi<TValue extends unknown> {
    handleValidation : EventHandler<ValidityChangeEvent>
    handleInit       : EditorChangeEventHandler<TValue>
    handleChange     : EditorChangeEventHandler<TValue>
}
export const useRequiredValidator      = <TValue extends unknown>(props: RequiredValidatorProps): RequiredValidatorApi<TValue> => {
    // props:
    const {
        // validations:
        required = false,
        customValidator,
    } = props;
    
    
    
    // states:
    // we stores the `isValid` in `useRef` instead of `useState` because we need to *real-time export* of its value:
    const isValid = useRef<ValResult>(null); // initially unchecked (neither valid nor invalid)
    
    // manually controls the (re)render event:
    const [triggerRender] = useTriggerRender();
    
    
    
    // functions:
    
    const asyncPerformUpdate = useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
    useEffect(() => {
        // cleanups:
        return () => {
            // cancel out previously performUpdate (if any):
            if (asyncPerformUpdate.current) clearTimeout(asyncPerformUpdate.current);
        };
    }, []); // runs once on startup
    
    const validate = (value: TValue) => {
        // remember the validation result:
        const currentIsValid = isSelectValid(required, value);
        const newIsValid : ValResult = (customValidator ? customValidator(currentIsValid) : currentIsValid);
        if (isValid.current !== newIsValid) {
            isValid.current = newIsValid;
            
            // lazy responsives => a bit delayed of responsives is ok:
            startTransition(() => {
                triggerRender(); // notify to react runtime to re-render with a new validity state
            });
        } // if
    };
    
    
    
    // handlers:
    
    /**
     * Handles the validation result.
     * @returns  
     * `null`  = uncheck.  
     * `true`  = valid.  
     * `false` = invalid.
     */
    const handleValidation   = useEvent<EventHandler<ValidityChangeEvent>>((event) => {
        if (event.isValid !== undefined) event.isValid = isValid.current;
    });
    
    const handleInitOrChange = useEvent<EditorChangeEventHandler<TValue>>((value) => {
        validate(value);
    });
    
    
    
    // api:
    return {
        handleValidation,
        handleInit   : handleInitOrChange,
        handleChange : handleInitOrChange,
    };
};
//#endregion RequiredValidator
