// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/button-icon'             // a button component with a nice icon
import {
    // simple-components:
    EditableButton,
}                           from '@reusable-ui/editable-button'         // a button with validation indicator
import {
    // layout-components:
    ListItemProps,
    ListItemComponentProps,
}                           from '@reusable-ui/list'                    // represents a series of content
import type {
    DropdownProps,
}                           from '@reusable-ui/dropdown'                // overlays contextual element such as lists, menus, and more
import type {
    DropdownListProps,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)
import {
    // menu-components:
    DropdownListExpandedChangeEvent,
    DropdownListButtonProps,
    DropdownListButton,
}                           from '@reusable-ui/dropdown-list-button'    // a button component with a dropdown list UI

// internal components:
import {
    SelectDropdownEditorItem,
}                           from './SelectDropdownEditorItem'

// heymarco:
import {
    // utilities:
    useControllable,
}                           from '@heymarco/events'

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    ListItemWithClickHandler,
}                           from './ListItemWithClickHandler'
import {
    // states:
    CustomValidatorHandler,
    useRequiredValidator,
}                           from './states/RequiredValidator'



// utilities:
const defaultValueToUi = <TValue extends any = string>(value: TValue|null): string => `${value ?? ''}`;



// react components:
export interface SelectDropdownEditorProps<TElement extends Element = HTMLButtonElement, TValue extends any = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue>,
            // validations:
            |'enableValidation'
            |'isValid'
            |'inheritValidation'
            |'onValidation'
            
            |'required'
            
            
            
            // values:
            |'value'
            |'onChange'
        >,
        Omit<DropdownListButtonProps<TDropdownListExpandedChangeEvent>,
            // values:
            |'value'
            |'onChange'
        >,
        ListItemComponentProps<Element>
{
    // validations:
    customValidator ?: CustomValidatorHandler
    
    
    
    // values:
    valueOptions     : TValue[]
    valueToUi       ?: (value: TValue|null) => string
    
    value            : TValue
}
const SelectDropdownEditor = <TElement extends Element = HTMLButtonElement, TValue extends any = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: SelectDropdownEditorProps<TElement, TValue, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // validations:
        enableValidation,  // take, to be handled by `<EditableButton>`
        isValid,           // take, to be handled by `<EditableButton>`
        inheritValidation, // take, to be handled by `<EditableButton>`
        onValidation,      // take, to be handled by `<EditableButton>` and `useRequiredValidator`
        customValidator,   // take, to be handled by                        `useRequiredValidator`
        
        required,          // take, to be handled by                        `useRequiredValidator`
        
        
        
        // values:
        valueOptions,
        valueToUi         = defaultValueToUi,
        
        value             : controllableValue,
        onChange          : onControllableValueChange,
        
        
        
        // components:
        listItemComponent = (<SelectDropdownEditorItem /> as React.ReactComponentElement<any, ListItemProps<Element>>),
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // states:
    const requiredValidator = useRequiredValidator<TValue>({
        // validations:
        required,
        customValidator,
    });
    const handleValidation  = useMergeEvents(
        // preserves the original `onValidation` from `props`:
        onValidation,
        
        
        
        // states:
        requiredValidator.handleValidation,
    );
    
    
    
    // states:
    const handleControllableValueChangeInternal = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onControllableValueChange,
        
        
        
        // states:
        
        // validations:
        requiredValidator.handleChange,
    );
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllable<TValue>({
        value              : controllableValue,
        onValueChange      : handleControllableValueChangeInternal,
    });
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        requiredValidator.handleInit(value);
    }, []);
    
    
    
    // default props:
    const {
        // variants:
        floatingPlacement = 'bottom-end',     // defaults to 'bottom-end'
        
        
        
        // components:
        dropdownComponent : dropdownListComponentRaw,
        
        
        
        // children:
        buttonChildren    = valueToUi(value), // defaults to `valueToUi(value)`
        
        
        
        // other props:
        ...restDropdownListButtonProps
    } = restSelectDropdownEditorProps;
    
    const defaultChildren : React.ReactElement = <>
        {valueOptions.map((valueOption, index) => {
            // default props:
            const {
                // states:
                active   = Object.is(valueOption, value),
                
                
                
                // children:
                children = valueToUi(valueOption),
                
                
                
                // other props:
                ...restListItemProps
            } = listItemComponent.props;
            
            
            
            // jsx:
            return (
                <ListItemWithClickHandler
                    // identifiers:
                    key={index}
                    
                    
                    
                    // components:
                    listItemComponent={
                        React.cloneElement<ListItemProps<Element>>(listItemComponent,
                            // props:
                            {
                                // other props:
                                ...restListItemProps,
                                
                                
                                
                                // states:
                                active : active,
                            },
                            
                            
                            
                            // children:
                            children,
                        )
                    }
                    
                    
                    
                    // handlers:
                    onClick={(event) => {
                        // conditions:
                        if (event.defaultPrevented) return;
                        
                        
                        
                        // actions:
                        triggerValueChange(valueOption, { triggerAt: 'immediately' });
                    }}
                />
            );
        })}
    </>;
    
    const dropdownListComponent = dropdownListComponentRaw as React.ReactElement<DropdownListProps<Element, TDropdownListExpandedChangeEvent>>|undefined;
    const {
        // components:
        listComponent,
        dropdownComponent,
        
        
        
        // children:
        children : dropdownListChildren = defaultChildren,
    } = dropdownListComponent?.props ?? {};
    
    const {
        // children:
        children : dropdownChildren,
    } = dropdownComponent?.props ?? {};
    
    
    
    // jsx:
    return (
        <DropdownListButton<TDropdownListExpandedChangeEvent>
            // other props:
            {...restDropdownListButtonProps}
            
            
            
            // variants:
            floatingPlacement={floatingPlacement}
            
            
            
            
            // components:
            buttonComponent={
                <EditableButton
                    // accessibilities:
                    assertiveFocusable={true}
                    
                    
                    
                    // validations:
                    enableValidation  = {enableValidation}
                    isValid           = {isValid}
                    inheritValidation = {inheritValidation}
                    onValidation      = {handleValidation}
                    
                    
                    
                    // components:
                    buttonComponent={
                        <ButtonIcon
                            // appearances:
                            icon='dropdown'
                            iconPosition='end'
                        />
                    }
                />
            }
            dropdownComponent={
                (dropdownListComponent === undefined)
                ? undefined
                
                /* <DropdownList> */
                : React.cloneElement<DropdownListProps<Element, TDropdownListExpandedChangeEvent>>(dropdownListComponent,
                    // props:
                    {
                        // components:
                        listComponent     : listComponent,
                        dropdownComponent : (
                            (dropdownComponent === undefined)
                            ? undefined
                            /* <Dropdown> */
                            : React.cloneElement<DropdownProps<Element, TDropdownListExpandedChangeEvent>>(dropdownComponent,
                                // props:
                                undefined,
                                
                                
                                
                                // children:
                                (
                                    (dropdownChildren !== listComponent)
                                    ? dropdownChildren
                                    : listComponent
                                ),
                            )
                        ),
                    },
                    
                    
                    
                    // children:
                    dropdownListChildren,
                ) as typeof dropdownListComponentRaw
            }
            
            
            
            // children:
            buttonChildren={buttonChildren}
        >
            {dropdownListChildren}
        </DropdownListButton>
    );
};
export {
    SelectDropdownEditor,            // named export for readibility
    SelectDropdownEditor as default, // default export to support React.lazy
}
