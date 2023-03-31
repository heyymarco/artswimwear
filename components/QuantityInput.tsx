// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'
import {
    // react helper hooks:
    useTriggerRender,
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
    
    
    
    // utilities:
    const minFn      : number  = min ?? 0;
    const maxFn      : number  = max ?? 9;
    const stepFn     : number  = Math.abs(step ?? 1);
    const negativeFn : boolean = (maxFn < minFn);
    
    const trimValue    = useEvent((value: number): number => {
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
    });
    const trimValueOpt = (value: number|undefined): number|undefined => {
        // conditions:
        if (value === undefined) return undefined;
        
        
        
        return trimValue(value);
    };
    
    
    
    // fn props:
    const valueFn        : number|undefined = trimValueOpt(value);
    const defaultValueFn : number|undefined = trimValueOpt(defaultValue);
    
    
    
    // source of truth:
    const valueRef         = useRef<number>(/*initialState: */valueFn ?? defaultValueFn ?? minFn);
    if (valueFn !== undefined) valueRef.current = valueFn;  //   controllable component mode: update the source_of_truth on every_re_render -- on every [value] prop changes
    const [triggerRender]  = useTriggerRender();            // uncontrollable component mode: update the source_of_truth when modified internally by internal component(s)
    
    type ChangeValueAction = 'setValue'|'decrease'|'increase'
    const changeValue      = useEvent((action: ChangeValueAction, amount: number): void => {
        let value = valueRef.current;
        switch (action) {
            case 'setValue': {
                value = trimValue(amount);
            } break;
            
            case 'decrease' : {
                value = trimValue(value - ((stepFn || 1) * (negativeFn ? -1 : 1) * amount));
            } break;
            case 'increase' : {
                value = trimValue(value + ((stepFn || 1) * (negativeFn ? -1 : 1) * amount));
            } break;
        } // switch
        
        
        
        // trigger `onChange` if the value changed:
        if (valueRef.current !== value) {
            if (valueFn === undefined) { // uncontrollable component mode: update the source_of_truth when modified internally by internal component(s)
                valueRef.current = value; // update
                triggerRender();          // sync the UI to `valueRef.current`
            }
            // else {
            //     // for controllable component mode: the update of [value] prop and the source_of_truth are decided by <Parent> component (on every_re_render).
            // }
            
            
            
            const inputElm = inputRefInternal.current;
            if (inputElm) {
                // *hack*: trigger `onChange` event:
                setTimeout(() => {
                    inputElm.valueAsNumber = value; // *hack* set_value before firing input event
                    
                    inputElm.dispatchEvent(new Event('input', { bubbles: true, cancelable: false, composed: true }));
                }, 0); // runs the 'input' event *next after* current event completed
            } // if
        } // if
    });
    
    
    
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
        
        
        
        // action:
        if (event.isTrusted) { // ignores the event emmited by `inputElm.dispatchEvent(new Event('input', { bubbles: true, cancelable: false, composed: true }));`
            changeValue('setValue', event.target.valueAsNumber);
        } // if
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    const handleDecrease       = useEvent<React.MouseEventHandler<HTMLButtonElement>>((_event) => {
        // action:
        changeValue('decrease', 1);
    });
    const handleIncrease       = useEvent<React.MouseEventHandler<HTMLButtonElement>>((_event) => {
        // action:
        changeValue('increase', 1);
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
            
            
            
            // styles:
            style={style}
        >
            <ButtonIcon icon='remove' title='decrease quantity' enabled={valueRef.current > minFn} onClick={handleDecrease} />
            <Input
                // rest props:
                {...restInputProps}
                
                
                
                // refs:
                elmRef={mergedInputRef}
                
                
                
                // values:
                {...{
                 // defaultValue : defaultValueFn,   // fully controllable, no defaultValue
                    value        : valueRef.current, // fully controllable
                    onChange     : handleChange,
                }}
                
                
                
                // validations:
                {...{
                    min  : negativeFn ? maxFn : minFn,
                    max  : negativeFn ? minFn : maxFn,
                    step : stepFn,
                }}
                
                
                
                // formats:
                type={type}
            />
            <ButtonIcon icon='add' title='increase quantity' enabled={valueRef.current < maxFn} onClick={handleIncrease} />
        </Group>
    );
};
export {
    QuantityInput,
    QuantityInput as default,
}
