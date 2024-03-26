// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // layout-components:
    useListActionItemStyleSheet,
    
    useListState,
    
    ListItemProps,
    ListItem,
    ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internal components:
import {
    RadioDecoratorProps,
    RadioDecorator,
    
    RadioDecoratorComponentProps,
}                           from '@/components/RadioDecorator'

// styles:
import {
    useSelectDropdownEditorItemStyleSheet,
}                           from './styles/loader'



// react components:
export interface SelectDropdownEditorItemProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>,
        ListItemComponentProps<Element>,
        
        // components:
        RadioDecoratorComponentProps
{
}
const SelectDropdownEditorItem = <TElement extends Element = HTMLElement>(props: SelectDropdownEditorItemProps<TElement>): JSX.Element|null => {
    // states:
    const {
        // behaviors:
        defaultActionCtrl,
    } = useListState();
    
    
    
    // props:
    const {
        // behaviors:
        actionCtrl              = defaultActionCtrl,
        
        
        
        // components:
        listItemComponent       = (<ListItem />       as React.ReactComponentElement<any, ListItemProps<Element>>),
        radioDecoratorComponent = (<RadioDecorator /> as React.ReactComponentElement<any, RadioDecoratorProps<Element>>),
        
        
        
        // children:
        children,
        
        
        
        // other props:
        ...restSelectDropdownEditorItem
    } = props;
    
    
    
    // styles:
    const styleSheet       = useSelectDropdownEditorItemStyleSheet();
    const actionStyleSheet = useListActionItemStyleSheet();
    
    
    
    // default props:
    const {
        // classes:
        mainClass                           = (
            actionCtrl
            ? `${styleSheet.main} ${actionStyleSheet.main}`
            : styleSheet.main
        ),                                                 // defaults to internal styleSheet
        
        
        
        // other props:
        ...restListItemProps
    } = restSelectDropdownEditorItem;
    
    const {
        // classes:
        className : radioDecoratorClassName = 'indicator', // defaults to 'indicator'
        
        
        
        // other props:
        ...restRadioDecoratorComponentProps
    } = radioDecoratorComponent?.props ?? {};
    
    
    
    // jsx:
    return React.cloneElement<ListItemProps<Element>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemProps,
            
            
            
            // classes:
            mainClass : mainClass,
        },
        
        
        
        // children:
        (!!radioDecoratorComponent && React.cloneElement<RadioDecoratorProps<Element>>(radioDecoratorComponent,
            // props:
            {
                // other props:
                ...restRadioDecoratorComponentProps,
                
                
                
                // classes:
                className : radioDecoratorClassName,
            },
        )),
        children,
    );
};
export {
    SelectDropdownEditorItem,            // named export for readibility
    SelectDropdownEditorItem as default, // default export to support React.lazy
}
