// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    
    
    
    // a capability of UI to rotate its layout:
    useOrientationableWithDirection,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListProps,
    List,
    
    
    
    // menu-components:
    defaultOrientationableWithDirectionOptions,
    Dropdown,
    DropdownList,
    
    
    
    // composite-components:
    useNavbarState,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import type {
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    SelectCurrencyEditorProps,
    SelectCurrencyEditor,
}                           from '@/components/editors/SelectCurrencyEditor'

// contexts:
import {
    // hooks:
    useCartState,
}                           from '@/components/Cart'

// internals:
import {
    useCurrencyMenuStyleSheet,
}                           from './styles/loader'

// configs:
import {
    paymentConfig,
}                           from '@/payment.config'



// react components:
interface CurrencyMenuProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<SelectCurrencyEditorProps<TElement>,
            // values:
            |'valueOptions'
            |'value'
        >
{
}
const CurrencyMenu = <TElement extends Element = HTMLElement>(props: CurrencyMenuProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // other props:
        ...CurrencyMenuProps
    } = props;
    
    // accessibility props:
    const {
        enabled,
        inheritEnabled,
        readOnly,
        inheritReadOnly,
        // active,        // activating the <Button> will not cause the <List> to active
        // inheritActive, // activating the <Button> will not cause the <List> to active
    } = props;
    
    
    
    // styles:
    const styleSheet = useCurrencyMenuStyleSheet();
    
    
    
    // variants:
    const basicVariantProps              = useBasicVariantProps(props);
    
    const dropdownOrientationableVariant = useOrientationableWithDirection(props, defaultOrientationableWithDirectionOptions);
    const determineDropdownOrientation   = () => {
        switch(dropdownOrientationableVariant.orientation) {
            case 'inline-start': return 'inline';
            case 'inline-end'  : return 'inline';
            case 'block-start' : return 'block';
            default            : return 'block';
        } // switch
    };
    
    
    
    // states:
    const {
        // states:
        navbarExpanded,
        
        
        
        // handlers:
        toggleList,
    } = useNavbarState();
    
    
    
    // contexts:
    const {
        // accessibilities:
        preferredCurrency,
        setPreferredCurrency,
    } = useCartState();
    
    
    
    // handlers:
    const handleClickInternal       = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        event.stopPropagation(); // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
    });
    const handleClick               = useMergeEvents(
        // preserves the original `onClick` from `props`:
        props.onClick,
        
        
        
        // actions:
        handleClickInternal,
    );
    
    const handleCollapseEndInternal = useEvent<EventHandler<void>>(() => {
        toggleList(false); // collapse the <Navbar> manually
    });
    const handleCollapseEnd         = useMergeEvents(
        // preserves the original `onCollapseEnd` from `props`:
        props.onCollapseEnd,
        
        
        
        // actions:
        handleCollapseEndInternal,
    );
    
    const handleChangeInternal      = useEvent<EditorChangeEventHandler<string>>((newValue) => {
        setPreferredCurrency(newValue);
    });
    const handleChange              = useMergeEvents(
        // preserves the original `onChange` from `props`:
        props.onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    
    
    // default props:
    const {
        // classes:
        className           = `${styleSheet.currencyMenu} ${!navbarExpanded ? 'navbarCollapsed' : ''}`,
        
        
        
        // values:
        onChange            = handleChange,
        
        
        
        // components:
        listRef,
        listOrientation     = 'block',
        listStyle,
        listComponent       = (<List<Element> /> as React.ReactElement<ListProps<Element>>),
        
        dropdownRef,
        dropdownOrientation = determineDropdownOrientation(),
        dropdownComponent   = (() => {
            const mutatedListComponent = React.cloneElement<ListProps<Element>>(listComponent,
                // props:
                {
                    // basic variant props:
                    ...basicVariantProps,
                    
                    
                    
                    // other props:
                    ...listComponent.props,
                    
                    
                    
                    // accessibility props:
                    enabled         : listComponent.props.enabled         ?? enabled,
                    inheritEnabled  : listComponent.props.inheritEnabled  ?? inheritEnabled,
                    readOnly        : listComponent.props.readOnly        ?? readOnly,
                    inheritReadOnly : listComponent.props.inheritReadOnly ?? inheritReadOnly,
                 // active          : listComponent.props.active          ?? active,       // activating the <Button> will not cause the <List> to active
                 // inheritActive   : listComponent.props.inheritActive   ?? inheritActive, // activating the <Button> will not cause the <List> to active
                },
            );
            
            
            
            // jsx:
            return (
                <DropdownList<Element>
                    // components:
                    elmRef              = {listRef}
                    orientation         = {listOrientation}
                    listStyle           = {listStyle}
                    listComponent={mutatedListComponent}
                    dropdownComponent={
                        <Dropdown<Element>
                            // classes:
                            className={`${styleSheet.currencyDropdown} ${!navbarExpanded ? 'navbarCollapsed' : ''}`}
                        >
                            {mutatedListComponent}
                        </Dropdown>
                    }
                    
                    dropdownRef         = {dropdownRef}
                    dropdownOrientation = {dropdownOrientation}
                />
            );
        })(),
        
        
        
        // handlers:
        onClick           = handleClick,
        onCollapseEnd     = handleCollapseEnd,
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = CurrencyMenuProps;
    
    
    
    // jsx:
    return (
        <SelectCurrencyEditor<TElement>
            // classes:
            className         = {className}
            
            
            
            // values:
            valueOptions      = {paymentConfig.paymentCurrencyOptions}
            value             = {preferredCurrency}
            onChange          = {onChange}
            
            
            
            // components:
            dropdownComponent = {dropdownComponent}
            
            
            
            // handlers:
            onClick           = {onClick}
            onCollapseEnd     = {onCollapseEnd}
            
            
            
            // other props:
            {...restSelectDropdownEditorProps}
        />
    );
};
export {
    CurrencyMenu,            // named export for readibility
    CurrencyMenu as default, // default export to support React.lazy
}
