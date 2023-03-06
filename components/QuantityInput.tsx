// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useRef,
    useState,
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
        value : controllableValue,
        onChange,
        
        
        
        // validations:
        min = 0,
        max = 9,
        step = 1,
        
        
        
        // formats:
        type = 'number',
    ...restInputProps} = props;
    
    
    
    // states:
    const [valueDn, setValueDn] = useState<number>(controllableValue ?? defaultValue ?? min);
    
    
    
    // fn props:
    const value : number = controllableValue /*controllable*/ ?? valueDn /*uncontrollable*/;
    
    
    
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
        const newValue = Math.min(Math.max(event.target.valueAsNumber, min), max);
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
        setValueDn((currentValue) => Math.max(currentValue - step, min));
    });
    const handleIncrease       = useEvent<React.MouseEventHandler<HTMLButtonElement>>((_event) => {
        // update:
        setValueDn((currentValue) => Math.min(currentValue + step, max));
    });
    
    
    
    // dom effects:
    // watchdog for slider change by user:
    const prevValueDn = useRef<number>(valueDn);
    useEffect(() => {
        // conditions:
        if (controllableValue !== undefined) return; // only for uncontrollable <Range> => ignore
        
        if (prevValueDn.current === valueDn) return; // no change detected => ignore
        prevValueDn.current = valueDn;
        
        const inputElm = inputRefInternal.current;
        if (!inputElm)                       return; // the <input> element was not initialized => ignore
        
        
        
        // *hack*: trigger `onChange` event:
        setTimeout(() => {
            inputElm.valueAsNumber = valueDn; // *hack* set_value before firing input event
            
            inputElm.dispatchEvent(new Event('input', { bubbles: true, cancelable: false, composed: true }));
        }, 0); // runs the 'input' event *next after* current event completed
    }, [controllableValue, valueDn]);
    
    
    
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
            <ButtonIcon icon='remove' title='decrease quantity' enabled={value > min} onClick={handleDecrease} />
            <Input
                // rest props:
                {...restInputProps}
                
                
                
                // refs:
                elmRef={mergedInputRef}
                
                
                
                // values:
                value={value}
                onChange={handleChange}
                
                
                
                // validations:
                min={min}
                max={max}
                step={step}
                
                
                
                // formats:
                type={type}
            />
            <ButtonIcon icon='add' title='increase quantity' enabled={value < max} onClick={handleIncrease} />
        </Group>
    );
};
export {
    QuantityInput,
    QuantityInput as default,
}
