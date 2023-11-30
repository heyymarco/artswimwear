// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
    Editor,
}                           from '@/components/editors/Editor'



// react components:
export interface DateTimeEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<EditorProps<TElement, Date|null>,
            // validations:
            |'minLength'|'maxLength' // text length constraint is not supported
            |'pattern'               // text regex is not supported
            |'min'|'max'|'step'      // only supports numeric value
            
            // formats:
            |'type'                  // only supports Date
            |'autoCapitalize'        // nothing to capitalize of Date
            |'inputMode'             // always 'numeric'
        >
{
    // validations:
    min  ?: Date
    max  ?: Date
    step ?: number
}
const DateTimeEditor = <TElement extends Element = HTMLElement>(props: DateTimeEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,
        value : controlledValue,
        onChange,
        
        
        
        // validations:
        min,
        max,
        step,
    ...restEditorProps} = props;
    
    
    
    // verifies:
    if (typeof(controlledValue) === 'string') throw Error('invalid data type of "value" property.');
    
    
    
    // states:
    const [uncontrolledValue, setUncontrolledValue] = useState<Date|null>(defaultValue ?? null);
    const value = controlledValue ?? uncontrolledValue;
    const isControllableValue = !!value;
    
    const [isFocus , setIsFocus ] = useState<boolean>(false);
    const [timezone, setTimezone] = useState<number>(() => (0 - (new Date()).getTimezoneOffset()));
    
    
    
    // utilities:
    const localToDate = (local: string|null|undefined): Date|null|undefined => {
        // conditions:
        if (!local) return (typeof(local) === 'string') ? null : local;
        
        
        
        // converts:
        const timezoneAbs       = Math.abs(timezone);
        const timezoneHours     = Math.floor(timezoneAbs / 60);
        const timezoneMinutes   = Math.round(timezoneAbs - (timezoneHours * 60))
        const localWithTimezone = `${local}${(timezone >= 0) ? '+' : '-'}${(timezoneHours < 10) ? '0' : ''}${timezoneHours}:${(timezoneMinutes < 10) ? '0' : ''}${timezoneMinutes}`;
        const date              = localWithTimezone ? new Date(localWithTimezone) : null;
        // console.log('localToDate: ', {
        //     local,
        //     localWithTimezone,
        //     date,
        // });
        return date;
    };
    const dateToLocal = (date: Date|null|undefined): string|null|undefined => {
        // conditions:
        if (!date) return date;
        
        
        
        // converts:
        const isoAslocalDate = new Date(date.valueOf() + (timezone * 60 * 1000));
        const local = isoAslocalDate.toISOString().slice(0, 16); // remove seconds and timezone // 2023-11-30T11:25:17.664Z => 2023-11-30T11:25
        return local;
    };
    
    
    
    // handlers:
    const handleChangeAsText = useEvent<EditorChangeEventHandler<string>>((valueAsString) => {
        const date = localToDate(valueAsString) ?? null;
        if (!isControllableValue) setUncontrolledValue(date);
        onChange?.(date);
    });
    
    const handleFocus = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(true);
    });
    const handleBlur = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(false);
    });
    
    
    
    // jsx:
    return (
        <Editor<TElement, string|null>
            // other props:
            {...restEditorProps}
            
            
            
            // values:
            value          = {dateToLocal(value) ?? null}
            onChangeAsText = {handleChangeAsText}
            
            
            
            // validations:
            min            = {dateToLocal(min) ?? undefined}
            max            = {dateToLocal(max) ?? undefined}
            step           = {step?.toString() ?? undefined}
            
            
            
            // formats:
            type={(!value && !isFocus) ? 'text' : 'datetime-local'}
            
            
            
            // handlers:
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
    );
};
export {
    DateTimeEditor,
    DateTimeEditor as default,
}
