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

// reusable-ui components:
import {
    // react components:
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
    Editor,
}                           from '@/components/editors/Editor'
import {
    // utilities:
    convertTimezoneToReadableClock,
    
    
    
    // react components:
    TimezoneEditor,
}                           from '@/components/editors/TimezoneEditor'



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
    // values:
    defaultTimezone  ?: number
    timezone         ?: number
    onTimezoneChange ?: EditorChangeEventHandler<number>
    
    
    
    // validations:
    min  ?: Date
    max  ?: Date
    step ?: number
}
const DateTimeEditor = <TElement extends Element = HTMLElement>(props: DateTimeEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        mainClass,
        classes,
        variantClasses,
        stateClasses,
        className,
        
        
        
        // styles:
        style,
        
        
        
        // values:
        defaultValue,
        value : controlledValue,
        onChange,
        
        defaultTimezone = (0 - (new Date()).getTimezoneOffset()),
        timezone : controlledTimezone,
        onTimezoneChange,
        
        
        
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
    const isControllableValue = (controlledValue !== undefined);
    
    const [isFocus , setIsFocus ] = useState<boolean>(false);
    const [uncontrolledTimezone, setUncontrolledTimezone] = useState<number>(defaultTimezone);
    const timezone = controlledTimezone ?? uncontrolledTimezone;
    const isControllableTimezone = (controlledTimezone !== undefined);
    
    
    
    // utilities:
    const localToDate = (local: string|null|undefined): Date|null|undefined => {
        // conditions:
        if (!local) return (typeof(local) === 'string') ? null : local;
        
        
        
        // converts:
        const localWithTimezone = `${local}${convertTimezoneToReadableClock(timezone)}`;
        const date              = new Date(localWithTimezone);
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
    const handleChangeAsText   = useEvent<EditorChangeEventHandler<string>>((valueAsString) => {
        const newDate = localToDate(valueAsString) ?? null;
        if (!isControllableValue) setUncontrolledValue(newDate);
        onChange?.(newDate);
    });
    const handleTimezoneChange = useEvent<EditorChangeEventHandler<number>>((newTimezone) => {
        if (!isControllableTimezone) setUncontrolledTimezone(newTimezone);
        onTimezoneChange?.(newTimezone);
    });
    
    const handleFocus          = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(true);
    });
    const handleBlur           = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(false);
    });
    
    
    
    // jsx:
    return (
        <Group
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
            <TimezoneEditor
                // variants:
                theme={theme ?? 'primary'}
                mild={mild ?? true}
                
                
                
                // classes:
                className='solid'
                
                
                
                // floatable:
                floatingPlacement='bottom-start'
                
                
                
                // values:
                value={timezone}
                onChange={handleTimezoneChange}
            />
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
        </Group>
    );
};
export {
    DateTimeEditor,
    DateTimeEditor as default,
}
