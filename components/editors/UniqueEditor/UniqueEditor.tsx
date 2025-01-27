// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    useMergeEvents,
    useMergeRefs,
    
    
    
    // an accessibility management system:
    usePropEnabled,
    
    
    
    // a possibility of UI having an invalid state:
    type ValidityChangeEvent,
    type ValidationDeps,
    type ValidationEventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    List,
    
    
    
    // notification-components:
    Tooltip,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// heymarco components:
import {
    type ValidityStatus,
}                           from '@heymarco/next-auth'
import {
    getValidityTheme,
    getValidityIcon,
}                           from '@heymarco/next-auth/utilities'
import {
    // types:
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    // react components:
    type TextEditorProps,
    TextEditor,
    
    type TextEditorComponentProps,
}                           from '@heymarco/text-editor'

// internals:
import {
    // states:
    type UniqueValidatorProps,
    useUniqueValidator,
}                           from './validations/uniqueValidator'



// react components:
export interface UniqueEditorProps<out TElement extends Element = HTMLSpanElement, TValue extends string = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        Omit<TextEditorProps<TElement, TValue, TChangeEvent>,
            // validations:
            |'pattern' // repladed with more specialized type
        >,
        
        // validations:
        UniqueValidatorProps,
        
        // components:
        TextEditorComponentProps<TElement, TValue, TChangeEvent>
{
    // validations:
    lengthHint      ?: React.ReactNode
    patternHint     ?: React.ReactNode
    availableHint   ?: React.ReactNode
    prohibitedHint  ?: React.ReactNode
}
const UniqueEditor = <TElement extends Element = HTMLSpanElement, TValue extends string = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: UniqueEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,
        
        
        
        // values:
        defaultValue          : defaultUncontrollableValue = '' as TValue,
        value                 : controllableValue,
        onChange              : onValueChange,
        
        
        
        // validations:
        validationDeps        : validationDepsOverwrite,
        onValidation,
        
        required              = false,
        
        minLength             = 0,
        maxLength             = Infinity,
        
        pattern,              // take, to be handled by `useUniqueValidator`
        
        currentValue,         // take, to be handled by `useUniqueValidator`
        onCheckAvailable,     // take, to be handled by `useUniqueValidator`
        onCheckNotProhibited, // take, to be handled by `useUniqueValidator`
        
        lengthHint            = <>Must be {minLength}-{maxLength} characters.</>,
        patternHint           = <>Must follow the specified pattern.</>,
        availableHint         = <>Must have never been registered.</>,
        prohibitedHint        = <>Must not contain prohibited words.</>,
        
        
        
        // components:
        textEditorComponent   = (<TextEditor<TElement, TValue, TChangeEvent> /> as React.ReactComponentElement<any, TextEditorProps<TElement, TValue, TChangeEvent>>),
        
        
        
        // handlers:
        onFocus,
        onBlur,
        
        
        
        // other props:
        ...restUniqueEditorProps
    } = props;
    
    
    
    // refs:
    const editorRef    = useRef<HTMLInputElement|null>(null);
    const mergedElmRef = useMergeRefs(
        // preserves the original `elmRef` from `textEditorComponent`:
        textEditorComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        editorRef,
    );
    
    
    
    // states:
    const handleValueChange         = useMergeEvents(
        // preserves the original `onChange` from `textEditorComponent`:
        textEditorComponent.props.onChange,
        
        
        
        // preserves the original `onChange` from `props`:
        onValueChange,
    );
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleValueChange,
    });
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const isEnabled = usePropEnabled(props);
    
    
    
    // handlers:
    const handleInputChangeInternal = useEvent<EditorChangeEventHandler<TValue, TChangeEvent>>((newValue, event) => {
        triggerValueChange(newValue, { triggerAt: 'immediately', event: event });
    });
    const handleInputChange         = useMergeEvents(
        // the code below is not required because it's already handled by `handleInputChangeInternal()` => `triggerValueChange()` => `useControllableAndUncontrollable` => `onValueChange` => `handleValueChange()` => `textEditorComponent.props.onChange()`:
        // // preserves the original `onChange` from `textEditorComponent`:
        // textEditorComponent.props.onChange,
        
        
        
        // actions:
        handleInputChangeInternal,
    );
    
    const handleFocusInternal       = useEvent((): void => {
        setIsFocused(true);
    });
    const handleFocus               = useMergeEvents(
        // preserves the original `onFocus` from `textEditorComponent`:
        textEditorComponent.props.onFocus,
        
        
        
        // preserves the original `onFocus` from `props`:
        onFocus,
        
        
        
        // actions:
        handleFocusInternal,
    );
    
    const handleBlurInternal        = useEvent((): void => {
        setIsFocused(false);
    });
    const handleBlur                = useMergeEvents(
        // preserves the original `onBlur` from `textEditorComponent`:
        textEditorComponent.props.onBlur,
        
        
        
        // preserves the original `onBlur` from `props`:
        onBlur,
        
        
        
        // actions:
        handleBlurInternal,
    );
    
    
    
    // validations:
    const {
        // states:
        isValidLength,
        
        isValidPattern,
        
        isValidAvailable,
        isValidNotProhibited,
        
        
        
        // handlers:
        handleValidation : uniqueValidatorHandleValidation,
    } = useUniqueValidator({
        // validations:
        required,
        
        minLength,
        maxLength,
        
        pattern,
        
        currentValue,
        onCheckAvailable,
        onCheckNotProhibited,
    }, value);
    const appendValidationDeps = useEvent<ValidationDeps>((bases) => [
        ...bases,
        
        // validations:
        pattern,
        
        currentValue,
        isValidAvailable,     // the *dynamic* result of `onCheckAvailable`
        isValidNotProhibited, // the *dynamic* result of `onCheckNotProhibited`
    ]);
    const mergedValidationDeps = useEvent<ValidationDeps>((bases) => {
        const basesStage2 = appendValidationDeps(bases);
        const basesStage3 = validationDepsOverwrite ? validationDepsOverwrite(basesStage2) : basesStage2;
        
        const validationDepsOverwrite2 = textEditorComponent.props.validationDeps;
        const basesStage4 = validationDepsOverwrite2 ? validationDepsOverwrite2(basesStage3) : basesStage3;
        
        return basesStage4;
    });
    const handleValidation = useEvent<ValidationEventHandler<ValidityChangeEvent>>(async (event) => {
        /* sequentially runs validators from `uniqueValidatorHandleValidation()` then followed by `textEditorComponent.props.onValidation()` and `props.onValidation()` */
        
        
        
        // states:
        // `uniqueValidator` is the primary validator, so it should be the first validation check:
        await uniqueValidatorHandleValidation(event);
        
        
        
        // preserves the original `onValidation` from `textEditorComponent`:
        // *component*Validator (if any) is the external supplement validator, so it should be the second-to-last validation check:
        await textEditorComponent.props.onValidation?.(event);
        
        
        
        // preserves the original `onValidation` from `props`:
        // *props*Validator (if any) is the external supplement validator, so it should be the last validation check:
        await onValidation?.(event);
    });
    
    const specificValidations = {
        // states:
        isValidLength,
        
        isValidPattern,
        
        isValidAvailable,
        isValidNotProhibited,
    };
    const validationMap = {
        Length        : (lengthHint     && ((minLength >= 1) || (maxLength <= Infinity))) ? lengthHint     : undefined,
        Pattern       : (patternHint    && pattern                                      ) ? patternHint    : undefined,
        Available     : (availableHint  && onCheckAvailable                             ) ? availableHint  : undefined,
        NotProhibited : (prohibitedHint && onCheckNotProhibited                         ) ? prohibitedHint : undefined,
    };
    
    
    
    // default props:
    const {
        // values:
        notifyValueChange = value,
        
        
        
        // states:
        enabled           = isEnabled,
        
        
        
        // other props:
        ...restTextEditorProps
    } = restUniqueEditorProps satisfies NoForeignProps<typeof restUniqueEditorProps, TextEditorProps<TElement, TValue, TChangeEvent>>;
    
    const {
        // values:
        value             : textEditorComponentValue             = value, // internally controllable
        
        notifyValueChange : textEditorComponentNotifyValueChange = notifyValueChange,
        
        
        
        // validations:
        required          : textEditorComponentRequired          = required,
        minLength         : textEditorComponentMinLength         = minLength,
        maxLength         : textEditorComponentMaxLength         = maxLength,
        
        
        
        // states:
        enabled           : textEditorComponentEnabled           = enabled,
        
        
        
        // other props:
        ...restTextEditorComponentProps
    } = textEditorComponent.props;
    
    
    
    // jsx:
    return (
        <>
            {/* <TextEditor> */}
            {React.cloneElement<TextEditorProps<TElement, TValue, TChangeEvent>>(textEditorComponent,
                // props:
                {
                    // other props:
                    ...restTextEditorProps,
                    ...restTextEditorComponentProps, // overwrites restTextEditorProps (if any conflics)
                    
                    
                    
                    // refs:
                    elmRef            : mergedElmRef,
                    
                    
                    
                    // values:
                    value             : textEditorComponentValue,
                    onChange          : handleInputChange,
                    notifyValueChange : textEditorComponentNotifyValueChange,
                    
                    
                    
                    // validations:
                    validationDeps    : mergedValidationDeps,
                    onValidation      : handleValidation,  // to be handled by `useUniqueValidator()`
                    
                    required          : textEditorComponentRequired,
                    minLength         : textEditorComponentMinLength,
                    maxLength         : textEditorComponentMaxLength,
                    
                    
                    
                    // states:
                    enabled           : textEditorComponentEnabled,
                    
                    
                    
                    // handlers:
                    onFocus           : handleFocus,
                    onBlur            : handleBlur,
                },
            )}
            
            {/* <Tooltip> */}
            <Tooltip
                // variants:
                theme='warning'
                
                
                
                // states:
                expanded={isFocused && enabled && (required || !!value)}
                
                
                
                // floatable:
                floatingPlacement='top'
                floatingOn={editorRef}
            >
                <List
                    // variants:
                    listStyle='flat'
                >
                    {Object.entries(validationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // certain validation is disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`isValid${validationType}`] as (ValidityStatus|undefined);
                        if (isValid === undefined) return null; // only show the invalid ones
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={index}
                                
                                
                                
                                // variants:
                                size='sm'
                                theme={getValidityTheme(isValid)}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={getValidityIcon(isValid)}
                                    
                                    
                                    
                                    // variants:
                                    size='sm'
                                />
                                &nbsp;
                                {text}
                            </ListItem>
                        );
                    })}
                </List>
            </Tooltip>
        </>
    );
};
export {
    UniqueEditor,            // named export for readibility
    UniqueEditor as default, // default export to support React.lazy
}
