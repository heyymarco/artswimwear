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

// internals:
import {
    type ValueOptions,
}                           from '../types'



// hooks:

// states:

//#region SelectValidator
export type CustomValidatorHandler = (isValid: ValResult) => ValResult

const isSelectValid = async <TValue extends unknown>(props: Omit<SelectValidatorProps<TValue>, 'customValidator'>, value: TValue): Promise<ValResult> => {
    // props:
    const {
        // values:
        valueOptions,
        excludedValueOptions,
        
        
        
        // validations:
        required      = false,
        freeTextInput = true,
    } = props;
    
    
    
    if ((value === undefined) || (value === null) || (value === '')) { // blank value
        return !required; // blank value & required => invalid
    } // if
    
    
    if (freeTextInput) return true; // valid for any value
    
    
    
    try {
        const resolvedValueOptions = (
            ((typeof(valueOptions) === 'object') && ('current' in valueOptions))
            ? await (valueOptions.current ?? [])
            : await valueOptions
        );
        const resolvedExcludedValueOptions = (
            ((typeof(excludedValueOptions) === 'object') && ('current' in excludedValueOptions))
            ? await (excludedValueOptions.current ?? [])
            : await excludedValueOptions
        );
        const finalValueOptions = (
            !resolvedExcludedValueOptions?.length
            ? resolvedValueOptions
            : resolvedValueOptions.filter((item) =>
                !resolvedExcludedValueOptions.includes(item)
            )
        );
        if (!finalValueOptions.some((finalValueOption) => Object.is(finalValueOption, value))) return false; // match option is not found => invalid
    }
    catch {
        return false; // unknown error
    } // try
    
    
    
    // all validation passes:
    return true; // valid
};

export interface SelectValidatorProps<TValue> {
    // values:
    valueOptions          : ValueOptions<TValue> // required! because it's a <SELECT> component
    excludedValueOptions ?: ValueOptions<TValue>
    
    
    
    // validations:
    required             ?: boolean
    freeTextInput        ?: boolean
    customValidator      ?: CustomValidatorHandler
}
export interface SelectValidatorApi<TValue extends unknown> {
    handleValidation : EventHandler<ValidityChangeEvent>
    handleInit       : EditorChangeEventHandler<TValue>
    handleChange     : EditorChangeEventHandler<TValue>
}
export const useSelectValidator = <TValue extends unknown>(props: SelectValidatorProps<TValue>): SelectValidatorApi<TValue> => {
    // props:
    const {
        // validations:
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
    
    const validate = async (value: TValue): Promise<void> => {
        // remember the validation result:
        const currentIsValid = await isSelectValid(props, value);
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
//#endregion SelectValidator
