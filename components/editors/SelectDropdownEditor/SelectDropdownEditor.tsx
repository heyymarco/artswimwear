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
    
    
    
    // a capability of UI to rotate its layout:
    OrientationName,
    useOrientationableWithDirection,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type ButtonProps,
}                           from '@reusable-ui/button'                  // a button component for initiating an action
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/button-icon'             // a button component with a nice icon
import {
    // simple-components:
    type EditableButtonProps,
    EditableButton,
    
    type EditableButtonComponentProps,
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
    
    
    
    // defaults:
    defaultOrientationableWithDirectionOptions,
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
            // values:
            |'value'
            |'onChange'
            
            
            
            // validations:
            |'enableValidation'
            |'isValid'
            |'inheritValidation'
            |'onValidation'
            
            |'required'
        >,
        Omit<DropdownListButtonProps<TDropdownListExpandedChangeEvent>,
            // values:
            |'value'
            |'onChange'
        >,
        
        // components:
        ListItemComponentProps<Element>,
        EditableButtonComponentProps
{
    // values:
    valueOptions     : TValue[]
    valueToUi       ?: (value: TValue|null) => string
    
    value            : TValue
    
    
    
    // validations:
    customValidator ?: CustomValidatorHandler
}
const SelectDropdownEditor = <TElement extends Element = HTMLButtonElement, TValue extends any = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: SelectDropdownEditorProps<TElement, TValue, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // variants:
    const dropdownOrientationableVariant = useOrientationableWithDirection(props, defaultOrientationableWithDirectionOptions);
    const determineDropdownIcon = () => {
        // TODO: RTL direction aware
        switch(dropdownOrientationableVariant.orientation) {
            case 'inline-start': return 'dropleft';
            case 'inline-end'  : return 'dropright';
            case 'block-start' : return 'dropup';
            default            : return 'dropdown';
        } // switch
    };
    const determineDropdownIconPosition = (buttonOrientation: OrientationName) => {
        switch(dropdownOrientationableVariant.orientation) {
            case 'inline-start':
                if (buttonOrientation === 'inline') return 'start';
                break;
            case 'inline-end'  :
                if (buttonOrientation === 'inline') return 'end';
                break;
            case 'block-start' :
                if (buttonOrientation === 'block') return 'start';
                break;
            default            :
                if (buttonOrientation === 'block') return 'end';
                break;
        } // switch
        
        return 'end';
    };
    
    
    
    // props:
    const {
        // values:
        valueOptions,
        valueToUi         = defaultValueToUi,
        
        value             : controllableValue,
        onChange          : onControllableValueChange,
        
        
        
        // validations:
        enableValidation,  // take, to be handled by `<EditableButton>`
        isValid,           // take, to be handled by `<EditableButton>`
        inheritValidation, // take, to be handled by `<EditableButton>`
        onValidation,      // take, to be handled by `<EditableButton>` and `useRequiredValidator`
        customValidator,   // take, to be handled by                        `useRequiredValidator`
        
        required,          // take, to be handled by                        `useRequiredValidator`
        
        
        
        // components:
        listItemComponent       = (<SelectDropdownEditorItem />                                                                                  as React.ReactElement<ListItemProps<Element>>),
        buttonOrientation       = 'inline',
        buttonComponent         = (<ButtonIcon iconPosition={determineDropdownIconPosition(buttonOrientation)} icon={determineDropdownIcon()} /> as React.ReactElement<ButtonProps>),
        editableButtonComponent = (<EditableButton />                                                                                            as React.ReactElement<EditableButtonProps>),
        
        
        
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
        // preserves the original `onValidation` from `editableButtonComponent`:
        editableButtonComponent.props.onValidation,
        
        
        
        // preserves the original `onValidation` from `props`:
        onValidation,
        
        
        
        // states:
        requiredValidator.handleValidation,
    );
    
    
    
    // states:
    const handleControllableValueChangeInternal = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onControllableValueChange,
        
        
        
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
    
    const {
        // validations:
        enableValidation   : editableButtonEnableValidation  = enableValidation,
        isValid            : editableButtonIsValid           = isValid,
        inheritValidation  : editableButtonInheritValidation = inheritValidation,
        
        
        
        // components:
        buttonComponent    : editableButtonButtonComponent   = buttonComponent,
        
        
        
        // other props:
        ...restEditableButtonProps
    } = editableButtonComponent.props;
    
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
                /* <EditableButton> */
                React.cloneElement<EditableButtonProps>(editableButtonComponent,
                    // props:
                    {
                        // other props:
                        ...restEditableButtonProps,
                        
                        
                        
                        // validations:
                        enableValidation   : editableButtonEnableValidation,
                        isValid            : editableButtonIsValid,
                        inheritValidation  : editableButtonInheritValidation,
                        onValidation       : handleValidation,  // to be handled by `useRequiredValidator()`
                        
                        
                        
                        // components:
                        buttonComponent    : editableButtonButtonComponent,
                    },
                )
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
