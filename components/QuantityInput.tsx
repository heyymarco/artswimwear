// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useRef,
    useState,
    useCallback,
}                           from 'react'
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    useMergeRefs,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component
import {
    ButtonIcon,
    
    Group,
    
    Input,
    InputProps,
}                           from '@reusable-ui/components'              // a set of official Reusable-UI components



export interface QuantityInputProps
    extends
        // bases:
        Omit<InputProps,
            // values:
            |'defaultValue'|'value'  // only supports numeric value
            
            // validations:
            |'required'              // never blank value => not supported
            |'minLength'|'maxLength' // text length constraint is not supported
            |'pattern'               // text regex is not supported
            |'min'|'max'|'step'      // only supports numeric value
            
            // children:
            |'children'              // no nested children
        >
{
    // values:
    defaultValue ?: number
    value        ?: number
    
    
    
    // validations:
    min          ?: number
    max          ?: number
    step         ?: number
}
const QuantityInput = (props: QuantityInputProps): JSX.Element|null => {
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
        
        
        
        // styles:
        style,
        
        
        
        // values:
        defaultValue,
        value,
        onChange,
        
        
        
        // validations:
        min,
        max,
        step,
        
        
        
        // formats:
        type = 'number',
    ...restInputProps} = props;
    
    
    
    // fn props:
    const minFn      : number  = min ?? 0;
    const maxFn      : number  = max ?? 9;
    const stepFn     : number  = Math.abs(step ?? 1);
    const negativeFn : boolean = (maxFn < minFn);
    
    
    
    // utilities:
    const trimValue = useCallback((value: number): number => {
        // make sure the requested value is between the min value & max value:
        value     = Math.min(Math.max(
            value
        , (negativeFn ? maxFn : minFn)), (negativeFn ? minFn : maxFn));
        
        // if step was specified => stepping the value starting from min value:
        if (stepFn > 0) {
            let steps    = Math.round((value - minFn) / stepFn); // get the_nearest_stepped_value
            
            // make sure the_nearest_stepped_value is not exceeded the max value:
            let maxSteps = (maxFn - minFn) / stepFn;
            maxSteps     = negativeFn ? Math.ceil(maxSteps) : Math.floor(maxSteps); // remove the decimal fraction
            
            // re-align the steps:
            steps        = negativeFn ? Math.max(steps, maxSteps) : Math.min(steps, maxSteps);
            
            // calculate the new value:
            value        = minFn + (steps * stepFn);
        } // if
        
        return value;
    }, [minFn, maxFn, stepFn, negativeFn]); // (re)create the function on every time the constraints changes
    const trimValueOpt = (value: number|undefined): number|null => {
        // conditions:
        if (value === undefined) return null;
        
        
        
        return trimValue(value);
    };
    
    
    
    // fn props:
    const valueFn        : number|null = trimValueOpt(value);
    const defaultValueFn : number|null = trimValueOpt(defaultValue);
    
    
    
    // states:
    const [valueDn, setValueDn] = useState<number>(/*initialState: */valueFn ?? defaultValueFn ?? minFn);
    
    
    
    // fn props:
    const valueNow : number = valueFn /*controllable*/ ?? valueDn /*uncontrollable*/;
    
    
    
    // refs:
    const inputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedInputRef   = useMergeRefs(
        // preserves the original `elmRef`:
        elmRef,
        
        
        
        inputRefInternal,
    );
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return;
        
        
        
        // update:
        const newValue = Math.min(Math.max(event.target.valueAsNumber, minFn), maxFn);
        setValueDn(newValue);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    const handleDecrease       = useEvent<React.MouseEventHandler<HTMLButtonElement>>((_event) => {
        // update:
        setValueDn((currentValue) => Math.max(currentValue - stepFn, minFn));
    });
    const handleIncrease       = useEvent<React.MouseEventHandler<HTMLButtonElement>>((_event) => {
        // update:
        setValueDn((currentValue) => Math.min(currentValue + stepFn, maxFn));
    });
    
    
    
    // dom effects:
    // watchdog for slider change by user:
    const prevValueDn = useRef<number>(valueDn);
    useEffect(() => {
        // conditions:
        if (valueNow === valueDn)            return; // only trigger event of dynamically changes by user interaction, not programatically by controllable [value]
        
        if (prevValueDn.current === valueDn) return; // no change detected => ignore
        prevValueDn.current = valueDn;
        
        const inputElm = inputRefInternal.current;
        if (!inputElm)                       return; // the <input> element was not initialized => ignore
        
        
        
        // *hack*: trigger `onChange` event:
        setTimeout(() => {
            inputElm.valueAsNumber = valueDn; // *hack* set_value before firing input event
            
            inputElm.dispatchEvent(new Event('input', { bubbles: true, cancelable: false, composed: true }));
        }, 0); // runs the 'input' event *next after* current event completed
    }, [valueFn, valueDn]);
    
    
    
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
            
            
            
            // styles:
            style={style}
        >
            <ButtonIcon icon='remove' title='decrease quantity' enabled={valueNow > minFn} onClick={handleDecrease} />
            <Input
                // rest props:
                {...restInputProps}
                
                
                
                // refs:
                elmRef={mergedInputRef}
                
                
                
                // values:
                // defaultValue : defaultValueFn,                 // fully controllable, no defaultValue
                value={(valueFn !== null) ? valueNow : undefined} // fully controllable -or- *hack*ed controllable
                onChange={handleChange}
                
                
                
                // validations:
                min={min}
                max={max}
                step={step}
                
                
                
                // formats:
                type={type}
            />
            <ButtonIcon icon='add' title='increase quantity' enabled={valueNow < maxFn} onClick={handleIncrease} />
        </Group>
    );
};
export {
    QuantityInput,
    QuantityInput as default,
}
