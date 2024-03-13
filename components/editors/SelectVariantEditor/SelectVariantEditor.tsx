// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useSelectVariantEditorStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllable,
}                           from '@heymarco/events'

// internal components:
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // layout-components:
    ListItem,
    
    ListProps,
    List,
}                           from '@reusable-ui/components'

// models:
import type {
    VariantDetail,
}                           from '@/models'



// react components:
interface SelectVariantEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ListProps<TElement>,
            // values:
            |'defaultValue' // not supported
            |'onChange'     // already taken over
            
            // children:
            |'children'     // already taken over
        >,
        Pick<EditorProps<TElement, VariantDetail['id']|null>,
            // values:
            |'value'
            |'onChange'
        >
{
    // data:
    models     : VariantDetail[]
    
    
    
    // values:
    nullable  ?: boolean
    value      : VariantDetail['id']|null
}
const SelectVariantEditor = <TElement extends Element = HTMLElement>(props: SelectVariantEditorProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet = useSelectVariantEditorStyleSheet();
    
    
    
    // props:
    const {
        // data:
        models,
        
        
        
        // values:
        nullable      = true,
        
        value         : controllableValue,
        onChange      : onControllableValueChange,
        
        
        
        // other props:
        ...restSelectVariantEditorProps
    } = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllable<VariantDetail['id']|null>({
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    
    
    // handlers:
    const handleChange = useEvent<EditorChangeEventHandler<VariantDetail['id']|null>>((newValue) => {
        triggerValueChange(newValue, { triggerAt: 'immediately' });
    });
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label': ariaLabel = 'Select Variant', // defaults to 'Select Variant'
        
        
        
        // behaviors:
        actionCtrl              = true,             // defaults to actionCtrl
        
        
        
        // other props:
        ...restListProps
    } = restSelectVariantEditorProps;
    
    
    
    // jsx:
    return (
        <List<TElement>
            // other props:
            {...restListProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // behaviors:
            actionCtrl={actionCtrl}
        >
            {!!nullable && <ListItem
                // accessibilities:
                active={value === null}
                
                
                
                // styles:
                className={styleSheet.item}
                
                
                
                // handlers:
                onClick={() => handleChange(null)}
            >
                <RadioDecorator className='indicator' />
                <p className='name'>
                    None
                </p>
            </ListItem>}
            
            {models.map(({id, name}) =>
                <ListItem
                    // identifiers:
                    key={id}
                    
                    
                    
                    // styles:
                    className={styleSheet.item}
                    
                    
                    
                    // accessibilities:
                    active={value === id}
                    
                    
                    
                    // handlers:
                    onClick={() => handleChange(id)}
                >
                    <RadioDecorator className='indicator' />
                    <p className='name'>
                        {name}
                    </p>
                </ListItem>
            )}
        </List>
    );
};
export {
    SelectVariantEditor,
    SelectVariantEditor as default,
}
