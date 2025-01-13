// react:
import {
    // hooks:
    useEffect,
    useState,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
    type TimerPromise,
    useSetTimeout,
    
    
    
    // a validation management system:
    type Result as ValResult,
    
    
    
    // a possibility of UI having an invalid state:
    type ValidityChangeEvent,
    type ValidationEventHandler,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    type ValidityStatus,
}                           from '@heymarco/next-auth'
import {
    isClientError,
}                           from '@heymarco/next-auth/utilities'



export type CheckAvailableHandler     = (value: string) => Promise<boolean>
export type CheckNotProhibitedHandler = (value: string) => Promise<boolean>
export interface UniqueValidatorProps {
    // validations:
    required             ?: boolean
    
    minLength            ?: number
    maxLength            ?: number
    
    pattern              ?: string|RegExp
    
    currentValue         ?: string
    onCheckAvailable     ?: CheckAvailableHandler
    onCheckNotProhibited ?: CheckNotProhibitedHandler
}
export interface UniqueValidatorApi {
    // states:
    isValidLength        : boolean
    
    isValidPattern       : boolean
    
    isValidAvailable     : ValidityStatus
    isValidNotProhibited : ValidityStatus
    
    
    
    // handlers:
    handleValidation     : ValidationEventHandler<ValidityChangeEvent>
}
export const useUniqueValidator = (props: UniqueValidatorProps, value: string): UniqueValidatorApi => {
    // props:
    const {
        // validations:
        required  = false,
        
        minLength = 0,
        maxLength = Infinity,
        
        pattern,
        
        currentValue,
        onCheckAvailable,
        onCheckNotProhibited,
    } = props;
    
    
    
    // states:
    const trimmedValue             = value.trim();
    const isValueBlank             = !trimmedValue;
    const isValuePresent           = !isValueBlank;
    
    /**
     * Checks if the `value` satisfies the `required` attribute.
     * If the `value` is present, it always returns `true` regardless of the `required` attribute.
     * If the input is NOT `required` (optional), it always returns `true` regardless of the `value` is present or blank.
     */
    const isValidRequired          : boolean = (
        isValuePresent // If the `value` is present                 => always *valid*, regardless of the `required` attribute.
        ||
        !required      // If the input is NOT `required` (optional) => always *valid*, regardless of the `value` is present or blank.
    );
    
    /**
     * Checks if the `value` is blank BUT `required`.
     */
    const precedenceIsBlankInvalid : boolean = isValueBlank &&  required;
    /**
     * Checks if the `value` is blank and the input is NOT `required` (optional).
     */
    const precedenceIsBlankValid   : boolean = isValueBlank && !required;
    
    /**
     * Checks if the length of the `value` is within the specified range.
     * If the `value` is blank and the input is NOT `required` (optional), it returns `true` regardless of the length.
     * If the `value` is blank BUT `required`, it returns `false` regardless of the length.
     */
    const isValidLength            : boolean = !precedenceIsBlankInvalid && (precedenceIsBlankValid || ((trimmedValue.length >= minLength) && (trimmedValue.length <= maxLength)));
    
    /**
     * Checks if the `value` matches the specified `pattern`.
     * If the `value` is blank and the input is NOT `required` (optional), it returns `true` regardless of the match.
     * If the `value` is blank BUT `required`, it returns `false` regardless of the match.
     * If no `pattern` is provided, it returns `true`.
     */
    const isValidPattern           : boolean = !precedenceIsBlankInvalid && (precedenceIsBlankValid || (!pattern /* no `pattern` is provided => always valid */ || !!value.match((pattern instanceof RegExp) ? pattern : new RegExp(`^(?:${pattern})$`, 'v'))));
    
    /**
     * Checks if the `value` satisfies the `required`, `minLength`, `maxLength`, and `pattern` attribute.
     */
    const isValidStatic            : boolean = (
        isValidRequired
        &&
        isValidLength
        &&
        isValidPattern
    );
    
    const initialDynamicValidity             = !precedenceIsBlankInvalid && (precedenceIsBlankValid || 'unknown' /* unprocessed yet */);
    const [isValidAvailable    , setIsValidAvailable    ] = useState<ValidityStatus>(initialDynamicValidity);
    const [isValidNotProhibited, setIsValidNotProhibited] = useState<ValidityStatus>(initialDynamicValidity);
    
    
    
    // handlers:
    const isMounted                       = useMountedFlag();
    const setTimeoutAsync                 = useSetTimeout();
    const handleDelayedCheck              = useEvent((setIsValid: (value: React.SetStateAction<ValidityStatus>) => void, onCheck: ((value: string) => Promise<boolean>)|undefined, delayedCheck: React.MutableRefObject<TimerPromise<boolean> | null>): void => {
        // conditions:
        if (precedenceIsBlankInvalid) {
            setIsValid(false);     // the `value` is blank BUT `required` => *invalid* => false
            return;
        }
        else if (precedenceIsBlankValid) {
            setIsValid(true);      // the `value` is blank and the input is NOT `required` (optional) => *valid* => true
            return;
        }
        else if ((currentValue !== undefined) && (value.toLowerCase() === currentValue.toLowerCase())) {
            setIsValid(true);      // assumes as *valid* if `value` matches to `currentValue`
            return;
        }
        else if (!isValidStatic) {
            setIsValid('unknown'); // one or more static validations are *invalid* => cannot further process API request validation => unknown result
            return;
        }
        else if (!onCheck) {
            setIsValid(true);      // assumes as *valid* if no `onCheck` is provided => no need to send API request validation
            return;
        } // if
        
        
        
        // actions:
        // abort the previous delayed check (if any):
        delayedCheck.current?.abort();
        delayedCheck.current = null; // mark as aborted
        
        setIsValid('unknown');
        
        // delay a brief moment, waiting for the user typing:
        const currentDelayedCheckPromise = setTimeoutAsync(500);
        delayedCheck.current = currentDelayedCheckPromise;
        currentDelayedCheckPromise.then(async (isDone): Promise<void> => {
            // conditions:
            if (!isDone) return; // the component was unloaded before the timer runs => do nothing
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            
            
            
            // actions:
            setIsValid('loading');
            try {
                // fetching:
                const result = await onCheck(value);
                
                
                
                // conditions:
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                if (delayedCheck.current !== currentDelayedCheckPromise) return; // aborted => do nothing
                delayedCheck.current = null; // mark as done
                
                
                
                // actions:
                if (!result) {
                    // failed
                    setIsValid(false);
                }
                else {
                    // success
                    setIsValid(true);
                } // if
            }
            catch (error) {
                // failed or error
                
                
                
                // conditions:
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                
                
                
                // actions:
                setIsValid(isClientError(error) ? false : 'error');
            } // try
        });
    });
    
    const delayedCheckAvailable           = useRef<TimerPromise<boolean>|null>(null);
    const handleDelayedCheckAvailable     = useEvent(() => {
        handleDelayedCheck(setIsValidAvailable, onCheckAvailable, delayedCheckAvailable);
    });
    
    const delayedCheckNotProhibited       = useRef<TimerPromise<boolean>|null>(null);
    const handleDelayedCheckNotProhibited = useEvent(() => {
        handleDelayedCheck(setIsValidNotProhibited, onCheckNotProhibited, delayedCheckNotProhibited);
    });
    
    
    
    // effects:
    useEffect(handleDelayedCheckAvailable    , [value]);
    useEffect(handleDelayedCheckNotProhibited, [value]);
    
    
    
    // handlers:
    /**
     * Handles the validation result.
     * @returns  
     * `null`  = uncheck.  
     * `true`  = valid.  
     * `false` = invalid.
     */
    const handleValidation = useEvent<ValidationEventHandler<ValidityChangeEvent>>(async (event) => {
        // conditions:
        if (event.isValid !== true) return; // ignore if was *invalid*|*uncheck* (only perform a further_validation if was *valid*)
        
        
        
        // further validations:
        const newIsValid : ValResult = (
            isValidRequired
            &&
            isValidLength
            &&
            isValidPattern
            &&
            (isValidAvailable === true)
            &&
            (isValidNotProhibited === true)
        );
        event.isValid = newIsValid; // update the validation result
    });
    
    
    
    // api:
    return {
        // states:
        isValidLength,
        
        isValidPattern,
        
        isValidAvailable,
        isValidNotProhibited,
        
        
        
        // handlers:
        handleValidation,
    };
};
