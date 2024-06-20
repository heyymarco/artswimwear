// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    useMergeRefs,
    useMountedFlag,
    
    
    
    // a possibility of UI having an invalid state:
    ValidityChangeEvent,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)
import {
    // react components:
    Group,
}                           from '@reusable-ui/group'                   // groups a list of components as a single component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// internals:
import {
    // types:
    type EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    // react components:
    type TextEditorProps,
    TextEditor,
    
    
    
    type TextEditorComponentProps,
}                           from '@/components/editors/TextEditor'
import {
    // validations:
    isSelectionValid,
    
    
    
    // react components:
    type SelectDropdownEditorProps,
    SelectDropdownEditor,
    
    
    
    type SelectDropdownEditorComponentProps,
}                           from '@/components/editors/SelectDropdownEditor'



// react components:
export interface TextDropdownEditorProps<TElement extends Element = HTMLDivElement>
    extends
        // bases:
        TextEditorProps<TElement>,
        Pick<SelectDropdownEditorProps<Element, string>,
            // // // ONLY NECESSARY props:
            // // // variants:
            // // |'buttonStyle'
            // // |'orientation' // the orientation of <Dropdown> __relative_to__ <Button>
            // // 
            // values:
            |'valueOptions'
            |'excludedValueOptions'
            |'valueToUi'
            // // 
            // validations:
            |'freeTextInput'
            |'equalityValueComparison'
            // // // ONLY NECESSARY props:
            // // 
            // // // states:
            // // |'defaultExpanded'
            // // |'expanded'
            // // |'onExpandedChange'
            // // 
            // // |'onExpandStart'
            // // |'onCollapseStart'
            // // |'onExpandEnd'
            // // |'onCollapseEnd'
            // // 
            // // // floatable:
            // // |'floatingRef'
            // // 
            // // |'floatingOn'
            // // // |'floatingFriends'
            // // |'floatingPlacement'
            // // |'floatingMiddleware'
            // // |'floatingStrategy'
            // // 
            // // |'floatingAutoFlip'
            // // |'floatingAutoShift'
            // // |'floatingOffset'
            // // |'floatingShift'
            // // 
            // // |'onFloatingUpdate'
            // // 
            // // // global stackable:
            // // |'viewport'
            // // 
            // // // auto focusable:
            // // |'autoFocusOn'
            // // |'restoreFocusOn'
            // // |'autoFocus'
            // // |'restoreFocus'
            // // |'autoFocusScroll'
            // // |'restoreFocusScroll'
            
            // components:
            |'buttonRef'
            |'buttonOrientation'
            |'buttonComponent'
            |'buttonChildren'
            |'toggleButtonComponent'
            |'dropdownRef'
            |'dropdownOrientation'
            |'dropdownComponent'
            |'listRef'
            |'listOrientation'
            |'listStyle'
            |'listComponent'
            |'listItemComponent'
            |'editableButtonComponent'
        >,
        
        // components:
        TextEditorComponentProps<TElement>,
        SelectDropdownEditorComponentProps<Element, string, DropdownListExpandedChangeEvent<string>>
{
    // behaviors:
    autoShowDropdownOnFocus ?: boolean
    preferFocusOnTextEditor ?: boolean
}
const TextDropdownEditor = <TElement extends Element = HTMLDivElement>(props: TextDropdownEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,                              // take, moved to <TextEditor>
        outerRef,                            // take, moved to <Group>
        
        
        
        // identifiers:
        id,                                  // take, moved to <Group>
        
        
        
        // variants:
        size,                                // take, moved to <Group>
        theme,                               // take, moved to <Group>
        gradient,                            // take, moved to <Group>
        outlined,                            // take, moved to <Group>
        mild,                                // take, moved to <Group>
        
        
        
        // classes:
        mainClass,                           // take, moved to <Group>
        classes,                             // take, moved to <Group>
        variantClasses,                      // take, moved to <Group>
        stateClasses,                        // take, moved to <Group>
        className,                           // take, moved to <Group>
        
        
        
        // styles:
        style,                               // take, moved to <Group>
        
        
        
        // values:
        valueOptions,                        // take, moved to <SelectDropdownEditor>
        excludedValueOptions,                // take, moved to <SelectDropdownEditor>
        valueToUi,                           // take, moved to <SelectDropdownEditor>
        
        defaultValue   : defaultUncontrollableValue = '',
        value          : controllableValue,
        onChange       : onControllableValueChange,
        onChangeAsText : onControllableTextChange,
        
        
        
        // validations:
        onValidation,                        // take, moved to <TextEditor>
        freeTextInput           = true,      // take, to be handled by internal controllableValidator
        equalityValueComparison = Object.is, // take, to be handled by internal controllableValidator
        
        
        
        // behaviors:
        autoShowDropdownOnFocus = true,
        preferFocusOnTextEditor = true,
        
        
        
        // components:
        buttonRef,                                         // take, moved to <SelectDropdownEditor>
        buttonOrientation,                                 // take, moved to <SelectDropdownEditor>
        buttonComponent,                                   // take, moved to <SelectDropdownEditor>
        buttonChildren = null /* remove text on button */, // take, moved to <SelectDropdownEditor>
        toggleButtonComponent,                             // take, moved to <SelectDropdownEditor>
        dropdownRef,                                       // take, moved to <SelectDropdownEditor>
        dropdownOrientation,                               // take, moved to <SelectDropdownEditor>
        dropdownComponent,                                 // take, moved to <SelectDropdownEditor>
        listRef,                                           // take, moved to <SelectDropdownEditor>
        listOrientation,                                   // take, moved to <SelectDropdownEditor>
        listStyle,                                         // take, moved to <SelectDropdownEditor>
        listComponent,                                     // take, moved to <SelectDropdownEditor>
        listItemComponent,                                 // take, moved to <SelectDropdownEditor>
        editableButtonComponent,                           // take, moved to <SelectDropdownEditor>
        textEditorComponent           = (<TextEditor<TElement> />                                                                                       as React.ReactElement<TextEditorProps<TElement>>),
        selectDropdownEditorComponent = (<SelectDropdownEditor<Element, string, DropdownListExpandedChangeEvent<string>> valueOptions={valueOptions} /> as React.ReactElement<SelectDropdownEditorProps<Element, string, DropdownListExpandedChangeEvent<string>>>),
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // states:
    const handleControllableValueChangeInternal = useEvent<EditorChangeEventHandler<string>>((newValue) => {
        // normalize: null => empty string, string => string:
        onControllableTextChange?.((newValue !== null) ? newValue : '' /* null => empty string */);
    });
    const handleControllableValueChange         = useMergeEvents(
        // preserves the original `onChange` from `textEditorComponent`:
        textEditorComponent.props.onChange,
        
        
        
        // preserves the original `onChange` from `props`:
        onControllableValueChange,
        
        
        
        // actions:
        handleControllableValueChangeInternal,
    );
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<string>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleControllableValueChange,
    });
    
    
    
    // states:
    const [isDropdownValid  , setIsDropdownValid  ] = useState<boolean|null>(null);
    
    const enum ShowDropdown {
        SHOW_BY_TOGGLE     = 2,  // absolute set
        SHOW_BY_TEXT_FOCUS = 1,  // condition:      if     HIDE_BY_BLUR|HIDE_BY_SELECT
        
        HIDE_BY_TYPING     = -1, // condition:      if NOT HIDE_BY_BLUR
        HIDE_BY_SELECT     = -2, // condition:      if NOT HIDE_BY_BLUR
        HIDE_BY_TOGGLE     = -3, // condition:      if NOT HIDE_BY_BLUR
        HIDE_BY_BLUR       = -4, // absolute reset
    }
    const [showDropdown     , setShowDropdown     ] = useState<ShowDropdown>(ShowDropdown.HIDE_BY_BLUR);
    
    const noAutoShowDropdown                        = useRef<boolean>(false);
    
    const [finalValueOptions, setFinalValueOptions] = useState<string[]|undefined>(undefined);
    const isMounted = useMountedFlag();
    useEffect(() => {
        // setups:
        (async (): Promise<void> => {
            const [resolvedValueOptions, resolvedExcludedValueOptions] = await Promise.all([
                (
                    ((typeof(valueOptions) === 'object') && ('current' in valueOptions))
                    ? (valueOptions.current ?? [])
                    : valueOptions
                ),
                (
                    ((typeof(excludedValueOptions) === 'object') && ('current' in excludedValueOptions))
                    ? (excludedValueOptions.current ?? [])
                    : excludedValueOptions
                ),
            ]);
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            
            
            
            const finalValueOptions = (
                !resolvedExcludedValueOptions?.length
                ? resolvedValueOptions
                : resolvedValueOptions.filter((item) =>
                    !resolvedExcludedValueOptions.includes(item)
                )
            );
            setFinalValueOptions(finalValueOptions);
        })();
        
        
        
        // cleanups:
        return () => {
            setFinalValueOptions(undefined);
        };
    }, [valueOptions, excludedValueOptions]);
    
    
    
    // refs:
    const inputRefInternal      = useRef<HTMLInputElement|null>(null);
    const mergedInputRef        = useMergeRefs(
        // preserves the original `elmRef` from `textEditorComponent`:
        textEditorComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        inputRefInternal,
    );
    
    const outerRefInternal      = useRef<TElement|null>(null);
    const mergedOuterRef        = useMergeRefs(
        // preserves the original `outerRef` from `props`:
        outerRef,
        
        
        
        outerRefInternal,
    );
    
    const dropdownRefInternal   = useRef<Element|null>(null);
    const mergedDropdownRef     = useMergeRefs(
        // preserves the original `dropdownRef` from `props`:
        dropdownRef,
        
        
        
        dropdownRefInternal,
    );
    
    
    
    // handlers:
    const handleTextChange             = useEvent<EditorChangeEventHandler<string>>((newValue) => {
        triggerValueChange(newValue, { triggerAt: 'immediately' });
        if (showDropdown !== ShowDropdown.HIDE_BY_BLUR) setShowDropdown(ShowDropdown.HIDE_BY_TYPING); // autoClose the <Dropdown> when the user type on <Input>
    });
    
    const handleDropdownChangeInternal = useEvent<EditorChangeEventHandler<string>>((newValue) => {
        const inputElm = inputRefInternal.current;
        if (inputElm) {
            // react *hack*: trigger `onChange` event:
            const oldValue = inputElm.value;                     // react *hack* get_prev_value *before* modifying
            inputElm.value = newValue;                           // react *hack* set_value *before* firing `input` event
            (inputElm as any)._valueTracker?.setValue(oldValue); // react *hack* in order to React *see* the changes when `input` event fired
            
            
            
            // fire `input` native event to trigger `onChange` synthetic event:
            inputElm.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: false, composed: true, data: newValue, dataTransfer: null, inputType: 'insertText', isComposing: false, view: null, detail: 0 }));
        } // if
    });
    const handleDropdownChange         = useMergeEvents(
        // preserves the original `onChange` from `selectDropdownEditorComponent`:
        selectDropdownEditorComponent.props.onChange,
        
        
        
        // actions:
        handleDropdownChangeInternal,
    );
    
    const handleValidationInternal     = useEvent<EventHandler<ValidityChangeEvent>>((event) => {
        const textIsValid = (() => {
            // conditions:
            if (event.isValid !== true) return event.isValid; // ignore if was *invalid*|*uncheck* (only perform a further_validation if was *valid*)
            if (freeTextInput)          return event.isValid; // if freeTextInput => no further validations needed
            
            
            
            // further validations:
            const newIsValid = isSelectionValid(props, finalValueOptions, value);
            event.isValid = newIsValid;
            return newIsValid;
        })();
        
        
        
        // updates:
        if (isDropdownValid === textIsValid) return; // already in sync => ignore
        setIsDropdownValid(textIsValid); // sync
    });
    const handleValidation             = useMergeEvents(
        // preserves the original `onValidation` from `textEditorComponent`:
        textEditorComponent.props.onValidation,
        
        
        
        // preserves the original `onValidation` from `props`:
        onValidation,
        
        
        
        // states:
        handleValidationInternal,
    );
    
    const handleTextFocusInternal      = useEvent<React.FocusEventHandler<TElement>>(() => {
        // conditions:
        if (!autoShowDropdownOnFocus) return; // the autoDropdown is not active => ignore
        if (noAutoShowDropdown.current) {
            noAutoShowDropdown.current = false;
            return; // ignore focus internal_programatically
        } // if
        
        
        
        // actions:
        if ((showDropdown === ShowDropdown.HIDE_BY_BLUR) || (showDropdown === ShowDropdown.HIDE_BY_SELECT)) setShowDropdown(ShowDropdown.SHOW_BY_TEXT_FOCUS);
    });
    const handleTextFocus              = useMergeEvents(
        // preserves the original `onFocus` from `textEditorComponent`:
        textEditorComponent.props.onFocus,
        
        
        
        // preserves the original `onFocus` from `props`:
        props.onFocus,
        
        
        
        // actions:
        handleTextFocusInternal,
    );
    
    const handleTextClickInternal      = useEvent<React.MouseEventHandler<TElement>>(() => {
        // conditions:
        if (preferFocusOnTextEditor) return; // prefer focus on textEditor => no need to autoDropdown => ignore
        
        
        
        // actions:
        if ((showDropdown === ShowDropdown.HIDE_BY_BLUR) || (showDropdown === ShowDropdown.HIDE_BY_SELECT) || (showDropdown === ShowDropdown.HIDE_BY_TOGGLE)) setShowDropdown(ShowDropdown.SHOW_BY_TOGGLE);;
    });
    const handleTextClick              = useMergeEvents(
        // preserves the original `onClick` from `textEditorComponent`:
        textEditorComponent.props.onClick,
        
        
        
        // preserves the original `onClick` from `props`:
        props.onClick,
        
        
        
        // actions:
        handleTextClickInternal,
    );
    
    const handleExpandedChangeInternal = useEvent<EventHandler<DropdownListExpandedChangeEvent<string>>>(({expanded, actionType}) => {
        if (expanded) {
            setShowDropdown(ShowDropdown.SHOW_BY_TOGGLE);
        }
        else if (showDropdown !== ShowDropdown.HIDE_BY_BLUR) {
            const isHideBySelect = (typeof(actionType) === 'number');
            setShowDropdown(
                isHideBySelect
                ? ShowDropdown.HIDE_BY_SELECT
                : ShowDropdown.HIDE_BY_TOGGLE
            );
            
            
            
            // restore focus to <Input>:
            if (preferFocusOnTextEditor) {
                const performRestoreFocus = () => {
                    const inputElm = inputRefInternal.current;
                    if (inputElm) {
                        const textLength = inputElm.value.length; // get the latest text replacement
                        inputElm.setSelectionRange(textLength, textLength);
                        noAutoShowDropdown.current = true;
                        inputElm.focus?.({ preventScroll: true });
                    } // if
                };
                if (isHideBySelect) {
                    // wait until <Input>'s text is fully replaced:
                    setTimeout(performRestoreFocus, 0);
                } else {
                    // nothing was replaced => restore immediately:
                    performRestoreFocus();
                } // if
            } // if
        } // if
    });
    const handleExpandedChange         = useMergeEvents(
        // preserves the original `onExpandedChange` from `selectDropdownEditorComponent`:
        selectDropdownEditorComponent.props.onExpandedChange,
        
        
        
        // actions:
        handleExpandedChangeInternal,
    );
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (showDropdown === ShowDropdown.HIDE_BY_BLUR) return; // ignore if already fully hidden
        
        
        
        // handlers:
        const handleMouseDown = (event: MouseEvent): void => {
            // conditions:
            if (event.button !== 0) return; // only handle left click
            
            
            
            // although clicking on page won't change the focus, but we decided this event as lost focus on <Dropdown>:
            handleFocus({ target: event.target } as FocusEvent);
        };
        const handleFocus     = (event: FocusEvent): void => {
            const focusedTarget = event.target;
            if (!focusedTarget) return;
            
            
            
            if (focusedTarget instanceof Element) {
                if (outerRefInternal.current?.contains(focusedTarget))    return; // consider still focus if has focus inside <Group>
                if (dropdownRefInternal.current?.contains(focusedTarget)) return; // consider still focus if has focus inside <Dropdown>
            } // if
            setShowDropdown(ShowDropdown.HIDE_BY_BLUR);
        };
        
        
        
        // setups:
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('focus'    , handleFocus    , { capture: true }); // force `focus` as bubbling
        
        
        
        // cleanups:
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('focus'    , handleFocus    , { capture: true });
        };
    }, [showDropdown]);
    
    
    
    // default props:
    const {
        // other props:
        ...restTextEditorProps
    } = restSelectDropdownEditorProps;
    
    const {
        // classes:
        className          : textEditorClassName          = 'fluid',
        
        
        
        // accessibilities:
        assertiveFocusable : textEditorAssertiveFocusable = (!preferFocusOnTextEditor ? false : undefined),
        
        
        
        // values:
        value              : textEditorValue              = value,
        
        
        
        // other props:
        ...restTextEditorComponentProps
    } = textEditorComponent.props;
    
    const {
        // values:
        valueOptions            : selectDropdownEditorValueOptions         = valueOptions,
        excludedValueOptions    : selectDropdownEditorExcludedValueOptions = excludedValueOptions,
        valueToUi               : selectDropdownEditorValueToUi            = valueToUi,
        
        value                   : selectDropdownEditorValue                = value, // internally controllable
        
        
        
        // validations:
        enableValidation        : selectDropdownEnableValidation           = props.enableValidation,  // follows <Editor>
        isValid                 : selectDropdownIsValid                    = isDropdownValid,         // controllable
        inheritValidation       : selectDropdownInheritValidation          = props.inheritValidation, // follows <Editor>
        
        // onValidation         : selectDropdownOnValidation               = undefined,
        
        equalityValueComparison : selectDropdownEqualityValueComparison    = equalityValueComparison,
        
        
        
        // states:
        expanded                : selectDropdownexpanded                   = (showDropdown >= 1),
        
        
        
        // floatable:
        floatingOn              : selectDropdownonFloatingOn               = outerRefInternal,
        
        
        
        // auto focusable:
        autoFocus               : selectDropdownonAutoFocus                = (showDropdown === ShowDropdown.SHOW_BY_TEXT_FOCUS) ? !preferFocusOnTextEditor : true, // do NOT autoFocus when (autoDropdown -AND- preferFocusOnTextEditor), otherwise do autoFocus}
        restoreFocus            : selectDropdownonRestoreFocus             = false, // use hard coded restore focus
        
        
        
        // components:
        buttonRef               : selectDropdownonButtonRef                = buttonRef,
        buttonOrientation       : selectDropdownonButtonOrientation        = buttonOrientation,
        buttonComponent         : selectDropdownonButtonComponent          = buttonComponent,
        buttonChildren          : selectDropdownonButtonChildren           = buttonChildren,
        toggleButtonComponent   : selectDropdownonToggleButtonComponent    = toggleButtonComponent,
        dropdownRef             : selectDropdownonDropdownRef              = mergedDropdownRef,
        dropdownOrientation     : selectDropdownonDropdownOrientation      = dropdownOrientation,
        dropdownComponent       : selectDropdownonDropdownComponent        = dropdownComponent,
        listRef                 : selectDropdownonListRef                  = listRef,
        listOrientation         : selectDropdownonListOrientation          = listOrientation,
        listStyle               : selectDropdownonListStyle                = listStyle,
        listComponent           : selectDropdownonListComponent            = listComponent,
        listItemComponent       : selectDropdownonListItemComponent        = listItemComponent,
        editableButtonComponent : selectDropdownonEditableButtonComponent  = editableButtonComponent,
        
        
        
        // other props:
        ...restSelectDropdownEditorComponentProps
    } = selectDropdownEditorComponent.props;
    
    
    
    // jsx:
    return (
        <Group<TElement>
            // refs:
            outerRef={mergedOuterRef}
            
            
            
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
            {/* <TextEditor> */}
            {React.cloneElement<TextEditorProps<TElement>>(textEditorComponent,
                // props:
                {
                    // other props:
                    ...restTextEditorProps,
                    ...restTextEditorComponentProps, // overwrites restTextEditorProps (if any conflics)
                    
                    
                    
                    // refs:
                    elmRef             : mergedInputRef,
                    
                    
                    
                    // classes:
                    className          : textEditorClassName,
                    
                    
                    
                    // accessibilities:
                    assertiveFocusable : textEditorAssertiveFocusable,
                    
                    
                    
                    // values:
                    value              : textEditorValue,  // internally controllable
                    onChange           : handleTextChange, // internally controllable
                    
                    
                    
                    // validations:
                    onValidation       : handleValidation,
                    
                    
                    
                    // handlers:
                    onFocus            : handleTextFocus,
                    onClick            : handleTextClick,
                },
            )}
            
            
            {React.cloneElement<SelectDropdownEditorProps<Element, string, DropdownListExpandedChangeEvent<string>>>(selectDropdownEditorComponent,
                // props:
                {
                    // other props:
                    ...restSelectDropdownEditorComponentProps,
                    
                    
                    
                    // variants:
                    ...basicVariantProps,
                    
                    
                    
                    // values:
                    valueOptions            : selectDropdownEditorValueOptions,
                    excludedValueOptions    : selectDropdownEditorExcludedValueOptions,
                    valueToUi               : selectDropdownEditorValueToUi,
                    
                    value                   : selectDropdownEditorValue, // internally controllable
                    onChange                : handleDropdownChange,      // internally controllable
                    
                    
                    
                    // validations:
                    enableValidation        : selectDropdownEnableValidation,  // follows <Editor>
                    isValid                 : selectDropdownIsValid,           // controllable
                    inheritValidation       : selectDropdownInheritValidation, // follows <Editor>
                    
                    // onValidation         : selectDropdownOnValidation,
                    
                    equalityValueComparison : selectDropdownEqualityValueComparison,
                    
                    
                    
                    // states:
                    expanded                : selectDropdownexpanded,
                    onExpandedChange        : handleExpandedChange,
                    
                    
                    
                    // floatable:
                    floatingOn              : selectDropdownonFloatingOn,
                    
                    
                    
                    // auto focusable:
                    autoFocus               : selectDropdownonAutoFocus,
                    restoreFocus            : selectDropdownonRestoreFocus,
                    
                    
                    
                    // components:
                    buttonRef               : selectDropdownonButtonRef,
                    buttonOrientation       : selectDropdownonButtonOrientation,
                    buttonComponent         : selectDropdownonButtonComponent,
                    buttonChildren          : selectDropdownonButtonChildren,
                    toggleButtonComponent   : selectDropdownonToggleButtonComponent,
                    dropdownRef             : selectDropdownonDropdownRef,
                    dropdownOrientation     : selectDropdownonDropdownOrientation,
                    dropdownComponent       : selectDropdownonDropdownComponent,
                    listRef                 : selectDropdownonListRef,
                    listOrientation         : selectDropdownonListOrientation,
                    listStyle               : selectDropdownonListStyle,
                    listComponent           : selectDropdownonListComponent,
                    listItemComponent       : selectDropdownonListItemComponent,
                    editableButtonComponent : selectDropdownonEditableButtonComponent,
                },
            )}
        </Group>
    );
};
export {
    TextDropdownEditor,            // named export for readibility
    TextDropdownEditor as default, // default export to support React.lazy
}
