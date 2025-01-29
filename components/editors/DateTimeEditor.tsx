// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    useMergeEvents,
    
    
    
    // an accessibility management system:
    usePropAccessibility,
    AccessibilityProvider,
    
    
    
    // a possibility of UI having an invalid state:
    type ValidationDeps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco core:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// reusable-ui components:
import {
    // react components:
    type GroupProps,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    type InputEditorProps,
    InputEditor,
    type InputEditorComponentProps,
}                           from '@heymarco/input-editor'

// internals:
import {
    // utilities:
    convertTimezoneToReadableClock,
    
    
    
    // react components:
    type TimezoneEditorProps,
    TimezoneEditor,
}                           from '@/components/editors/TimezoneEditor'
export {
    // utilities:
    convertTimezoneToReadableClock,
}                           from '@/components/editors/TimezoneEditor'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// utilities:
const localToDate = (local: string, timezone: number): Date|null => {
    // conditions:
    if (!local) return null;
    
    
    
    // converts:
    const localWithTimezone = `${local}${convertTimezoneToReadableClock(timezone)}`;
    const dateAsNum         = Date.parse(localWithTimezone);
    if (isNaN(dateAsNum)) return null;
    return new Date(dateAsNum);
};
const dateToLocal = (date: Date|null|undefined, timezone: number): string|null => {
    // conditions:
    if (!date) return null;
    
    
    
    // converts:
    const isoAslocalDate = new Date(date.valueOf() + (timezone * 60 * 60 * 1000 /* hours to milliseconds */));
    const local = isoAslocalDate.toISOString().slice(0, 16); // remove seconds and timezone // 2023-11-30T11:25:17.664Z => 2023-11-30T11:25
    return local;
};



// react components:
export interface DateTimeEditorProps<out TElement extends Element = HTMLSpanElement, TValue extends Date|null = Date|null, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        Pick<GroupProps<TElement>,
            // refs:
            |'outerRef'       // moved to <Group>
            
            // identifiers:
            |'id'             // moved to <Group>
            
            // variants:
            |'size'           // moved to <Group>
            |'theme'          // moved to <Group>
            |'gradient'       // moved to <Group>
            |'outlined'       // moved to <Group>
            |'mild'           // moved to <Group>
            
            // classes:
            |'mainClass'      // moved to <Group>
            |'classes'        // moved to <Group>
            |'variantClasses' // moved to <Group>
            |'stateClasses'   // moved to <Group>
            |'className'      // moved to <Group>
            
            // styles:
            |'style'          // moved to <Group>
        >,
        Omit<InputEditorProps<Element, TValue, TChangeEvent>,
            // refs:
            |'outerRef'       // moved to <Group>
            
            // identifiers:
            |'id'             // moved to <Group>
            
            // variants:
            |'size'           // moved to <Group>
            |'theme'          // moved to <Group>
            |'gradient'       // moved to <Group>
            |'outlined'       // moved to <Group>
            |'mild'           // moved to <Group>
            
            // classes:
            |'mainClass'      // moved to <Group>
            |'classes'        // moved to <Group>
            |'variantClasses' // moved to <Group>
            |'stateClasses'   // moved to <Group>
            |'className'      // moved to <Group>
            
            // styles:
            |'style'          // moved to <Group>
            
            // validations:
            |'minLength'|'maxLength' // text length constraint is not supported
            |'min'|'max'|'step'      // changed type to Date and number
            |'pattern'               // text regex is not supported
            
            // formats:
            |'type'                  // only supports Date
            |'autoCapitalize'        // nothing to capitalize of Date
            |'inputMode'             // always 'numeric'
        >,
        
        // components:
        InputEditorComponentProps<Element, string, TChangeEvent> // we use `TValue` for the exposed `value` but use `string` for internal `<InputEditor>`'s `value`
{
    // values:
    defaultTimezone  ?: TimezoneEditorProps['defaultValue']
    timezone         ?: TimezoneEditorProps['value']
    onTimezoneChange ?: TimezoneEditorProps['onChange']
    
    
    
    // validations:
    min              ?: Date   // changed type to Date
    max              ?: Date   // changed type to Date
    step             ?: number // changed type to number
}
const DateTimeEditor = <TElement extends Element = HTMLSpanElement, TValue extends Date|null = Date|null, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: DateTimeEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,                                              // take, moved to <InputEditor>
        outerRef,                                            // take, moved to <Group>
        
        
        
        // identifiers:
        id,                                                  // take, moved to <Group>
        
        
        
        // variants:
        size,                                                // take, moved to <Group>
        theme,                                               // take, moved to <Group>
        gradient,                                            // take, moved to <Group>
        outlined,                                            // take, moved to <Group>
        mild,                                                // take, moved to <Group>
        
        
        
        // classes:
        mainClass,                                           // take, moved to <Group>
        classes,                                             // take, moved to <Group>
        variantClasses,                                      // take, moved to <Group>
        stateClasses,                                        // take, moved to <Group>
        className,                                           // take, moved to <Group>
        
        
        
        // styles:
        style,                                               // take, moved to <Group>
        
        
        
        // values:
        defaultValue         : defaultUncontrollableValue    = (null as TValue),
        value                : controllableValue,
        onChange             : onValueChange,
        
        defaultTimezone      : defaultUncontrollableTimezone = checkoutConfigShared.intl.defaultTimezone,
        timezone             : controllableTimezone,
        onTimezoneChange,
        
        
        
        // validations:
        enableValidation,                                    // take, moved to <InputEditor>
        isValid,                                             // take, moved to <InputEditor>
        inheritValidation,                                   // take, moved to <InputEditor>
        validationDeps       : validationDepsOverwrite,      // take, moved to <InputEditor>
        onValidation,                                        // take, moved to <InputEditor>
        
        validDelay,                                          // take, moved to <InputEditor>
        invalidDelay,                                        // take, moved to <InputEditor>
        noValidationDelay,                                   // take, moved to <InputEditor>
        
        min,
        max,
        step,
        
        
        
        // components:
        inputEditorComponent = (<InputEditor<Element, string, TChangeEvent> /> as React.ReactElement<InputEditorProps<Element, string, TChangeEvent>>),
        
        
        
        // handlers:
        onChangeAsText,
        onFocus,
        onBlur,
        
        
        
        // other props:
        ...restPreInputEditorProps
    } = props;
    
    const appendValidationDeps = useEvent<ValidationDeps>((bases) => [
        ...bases,
        
        // validations:
        /* none */
    ]);
    const mergedValidationDeps = useEvent<ValidationDeps>((bases) => {
        const basesStage2 = appendValidationDeps(bases);
        const basesStage3 = validationDepsOverwrite ? validationDepsOverwrite(basesStage2) : basesStage2;
        
        const validationDepsOverwrite2 = inputEditorComponent.props.validationDeps;
        const basesStage4 = validationDepsOverwrite2 ? validationDepsOverwrite2(basesStage3) : basesStage3;
        
        return basesStage4;
    });
    
    
    
    // verifies:
    // when interacting with JSON APIs, it's common to receive Date as string, so we need to ensure the provided value's type is Date:
    if ((controllableValue !== undefined) && (typeof(controllableValue) === 'string')) throw Error('Invalid data type of "value" property. It should be Date, not string.');
    
    
    
    // accessibilities:
    const propAccess = usePropAccessibility(props);
    
    
    
    // states:
    const [isFocus , setIsFocus ] = useState<boolean>(false);
    
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onValueChange,
    });
    
    const {
        value              : timezone,
        triggerValueChange : triggerTimezoneChange,
    } = useControllableAndUncontrollable<number, React.MouseEvent<Element, MouseEvent>>({
        defaultValue       : defaultUncontrollableTimezone,
        value              : controllableTimezone,
        onValueChange      : onTimezoneChange,
    });
    
    
    
    // props:
    const {
        // values:
        notifyValueChange    = value,                        // take, to be handled by `<NumberEditor>`
        
        
        
        // other props:
        ...restInputEditorProps
    } = restPreInputEditorProps;
    
    
    
    // handlers:
    const handleChangeAsTextInternal = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((valueAsString, event) => {
        const newDate = localToDate(valueAsString, timezone) as TValue;
        triggerValueChange(newDate, { triggerAt: 'immediately', event: event });
    });
    const handleChangeAsText         = useMergeEvents(
        // preserves the original `onChangeAsText` from `inputEditorComponent`:
        inputEditorComponent.props.onChangeAsText,
        
        
        
        // preserves the original `onChangeAsText` from `props`:
        onChangeAsText,
        
        
        
        // actions:
        handleChangeAsTextInternal,
    );
    
    const handleTimezoneChange       = useEvent<EditorChangeEventHandler<number, React.MouseEvent<Element, MouseEvent>>>((newTimezone, event) => {
        triggerTimezoneChange(newTimezone, { triggerAt: 'immediately', event: event });
    });
    
    const handleFocusInternal        = useEvent<React.FocusEventHandler<Element>>(() => {
        setIsFocus(true);
    });
    const handleFocus                = useMergeEvents(
        // preserves the original `onFocus` from `inputEditorComponent`:
        inputEditorComponent.props.onFocus,
        
        
        
        // preserves the original `onFocus` from `props`:
        onFocus,
        
        
        
        // actions:
        handleFocusInternal,
    );
    
    const handleBlurInternal         = useEvent<React.FocusEventHandler<Element>>(() => {
        setIsFocus(false);
    });
    const handleBlur                 = useMergeEvents(
        // preserves the original `onBlur` from `inputEditorComponent`:
        inputEditorComponent.props.onBlur,
        
        
        
        // preserves the original `onBlur` from `props`:
        onBlur,
        
        
        
        // actions:
        handleBlurInternal,
    );
    
    
    
    // default props:
    const {
        // values:
        value             : inputEditorComponentValue             = (dateToLocal(value, timezone) ?? ''), // internally controllable
        
        notifyValueChange : inputEditorComponentNotifyValueChange = notifyValueChange,
        
        
        
        // validations:
        enableValidation  : inputEditorComponentEnableValidation  = enableValidation,
        isValid           : inputEditorComponentIsValid           = isValid,
        inheritValidation : inputEditorComponentInheritValidation = inheritValidation,
        
        validDelay        : inputEditorComponentValidDelay        = validDelay,
        invalidDelay      : inputEditorComponentInvalidDelay      = invalidDelay,
        noValidationDelay : inputEditorComponentNoValidationDelay = noValidationDelay,
        
        min               : inputEditorComponentMin               = (dateToLocal(min, timezone)   ?? undefined),
        max               : inputEditorComponentMax               = (dateToLocal(max, timezone)   ?? undefined),
        step              : inputEditorComponentStep              = (step?.toString()             ?? undefined),
        
        
        
        // formats:
        type              : inputEditorComponentType              = (
            (!value && !isFocus) // if no value and not focused
            ? 'text'             // shows placeholder
            : 'datetime-local'   // shows date and time
        ),
        
        
        
        // other props:
        ...restInputEditorComponentProps
    } = inputEditorComponent.props;
    
    
    
    // jsx:
    return (
        <AccessibilityProvider {...propAccess}>
            <Group<TElement>
                // refs:
                outerRef={outerRef}
                
                
                
                // identifiers:
                id={id}
                
                
                
                // variants:
                size={size}
                theme={theme}
                gradient={gradient}
                outlined={outlined}
                mild={mild}
                
                
                
                // classes:
                mainClass={mainClass}
                classes={classes}
                variantClasses={variantClasses}
                stateClasses={stateClasses}
                className={className}
                
                
                
                // styles:
                style={style}
            >
                <TimezoneEditor<Element>
                    // variants:
                    theme={theme ?? 'primary'}
                    mild={mild ?? true}
                    
                    
                    
                    // classes:
                    className='solid'
                    
                    
                    
                    // floatable:
                    floatingPlacement='bottom-start'
                    
                    
                    
                    // values:
                    value={timezone}                // internally controllable
                    onChange={handleTimezoneChange} // internally controllable
                />
                
                {/* <InputEditor> */}
                {React.cloneElement<InputEditorProps<Element, string, TChangeEvent>>(inputEditorComponent,
                    // props:
                    {
                        // other props:
                        ...restInputEditorProps satisfies NoForeignProps<typeof restInputEditorProps, InputEditorProps<Element, string, TChangeEvent>>,
                        ...restInputEditorComponentProps, // overwrites restInputEditorProps (if any conflics)
                        
                        
                        
                        // values:
                        value             : inputEditorComponentValue, // internally controllable
                        onChangeAsText    : handleChangeAsText,        // internally controllable
                        
                        notifyValueChange : inputEditorComponentNotifyValueChange,
                        
                        
                        
                        // validations:
                        enableValidation  : inputEditorComponentEnableValidation,
                        isValid           : inputEditorComponentIsValid,
                        inheritValidation : inputEditorComponentInheritValidation,
                        validationDeps    : mergedValidationDeps,
                        onValidation      : onValidation,
                        
                        validDelay        : inputEditorComponentValidDelay,
                        invalidDelay      : inputEditorComponentInvalidDelay,
                        noValidationDelay : inputEditorComponentNoValidationDelay,
                        
                        min               : inputEditorComponentMin,
                        max               : inputEditorComponentMax,
                        step              : inputEditorComponentStep,
                        
                        
                        
                        // formats:
                        type              : inputEditorComponentType,
                        
                        
                        
                        // handlers:
                        onFocus           : handleFocus,
                        onBlur            : handleBlur,
                    },
                )}
            </Group>
        </AccessibilityProvider>
    );
};
export {
    DateTimeEditor,            // named export for readibility
    DateTimeEditor as default, // default export to support React.lazy
}
