// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    useMergeRefs,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    usePropEnabled,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    List,
    
    
    
    // notification-components:
    Tooltip,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import type {
    ValidityStatus,
}                           from '@heymarco/next-auth'
import {
    getValidityTheme,
    getValidityIcon,
    isClientError,
}                           from '@heymarco/next-auth/utilities'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    // react components:
    TextEditorProps,
    TextEditor,
}                           from '@/components/editors/TextEditor'



// react components:
export interface UniqueEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        TextEditorProps<TElement>
{
    // values:
    currentValue         ?: string
    
    
    
    // constraints:
    minLength             : number
    maxLength             : number
    
    format                : RegExp
    formatHint            : React.ReactNode
    
    onCheckAvailable      : (value: string) => Promise<boolean>
    
    prohibitedHint       ?: React.ReactNode
    onCheckNotProhibited ?: (value: string) => Promise<boolean>
    
    
    
    // components:
    editorComponent      ?: React.ReactComponentElement<any, TextEditorProps<TElement>>
}
export type ImplementedUniqueEditorProps<TElement extends Element = HTMLSpanElement> = Omit<UniqueEditorProps<TElement>,
    // constraints:
    |'minLength'
    |'maxLength'
    
    |'format'
    |'formatHint'
    
    |'onCheckAvailable'
    
    |'prohibitedHint'
    |'onCheckNotProhibited'
>
const UniqueEditor = <TElement extends Element = HTMLSpanElement>(props: UniqueEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        currentValue,
        
        
        
        // constraints:
        minLength,
        maxLength,
        
        format,
        formatHint,
        
        onCheckAvailable,
        
        prohibitedHint,
        onCheckNotProhibited,
        
        
        
        // components:
        editorComponent = (<TextEditor<TElement> /> as React.ReactComponentElement<any, TextEditorProps<TElement>>),
    ...restEditorProps} = props;
    const required = editorComponent.props.required ?? props.required ?? false;
    
    
    
    // states:
    const [value               , setValue               ] = useState<string>(props.value ?? props.defaultValue ?? '');
    const [isUserInteracted    , setIsUserInteracted    ] = useState<boolean>(false);
    const [isFocused           , setIsFocused           ] = useState<boolean>(false);
    const [isValidAvailable    , setIsValidAvailable    ] = useState<ValidityStatus>('unknown');
    const [isValidNotProhibited, setIsValidNotProhibited] = useState<ValidityStatus>('unknown');
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<string>>((value) => {
        setValue(value);
        setIsUserInteracted(true);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `editorComponent`:
        editorComponent.props.onChange,
        
        
        
        // preserves the original `onChange` from `props`:
        props.onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    const handleFocusInternal  = useEvent((): void => {
        setIsFocused(true);
    });
    const handleFocus          = useMergeEvents(
        // preserves the original `onFocus` from `editorComponent`:
        editorComponent.props.onFocus,
        
        
        
        // preserves the original `onFocus` from `props`:
        props.onFocus,
        
        
        
        // actions:
        handleFocusInternal,
    );
    
    const handleBlurInternal   = useEvent((): void => {
        setIsFocused(false);
    });
    const handleBlur           = useMergeEvents(
        // preserves the original `onBlur` from `editorComponent`:
        editorComponent.props.onBlur,
        
        
        
        // preserves the original `onBlur` from `props`:
        props.onBlur,
        
        
        
        // actions:
        handleBlurInternal,
    );
    
    
    
    // dom effects:
    
    const isMounted = useMountedFlag();
    
    const isValidLength = (!value && !required) || ((value.length >= minLength) && (value.length <= maxLength));
    const isValidFormat = (!value && !required) || !!value.match(format);
    
    // validate availability:
    useEffect(() => {
        // conditions:
        if (
            !value
            ||
            !isValidLength
            ||
            !isValidFormat
        ) {
            setIsValidAvailable('unknown');
            return;
        } // if
        
        if (value && currentValue && (value.toLowerCase() === currentValue.toLowerCase())) {
            setIsValidAvailable(true);
            return;
        } // if
        
        
        
        // setups:
        const abortController = new AbortController();
        (async () => {
            try {
                // delay a brief moment, waiting for the user typing:
                setIsValidAvailable('unknown');
                await new Promise<void>((resolved) => {
                    setTimeout(() => {
                        resolved();
                    }, 500);
                });
                if (abortController.signal.aborted) return; // aborted => abort
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                setIsValidAvailable('loading');
                const result = await onCheckAvailable(value);
                if (abortController.signal.aborted) return; // aborted => abort
                if (!isMounted.current) return; // unmounted => abort
                if (!result) {
                    // failed
                    
                    
                    
                    setIsValidAvailable(false);
                    return;
                } // if
                
                
                
                // success
                
                
                
                // save the success:
                setIsValidAvailable(true);
            }
            catch (error) {
                // failed or error
                
                
                
                if (abortController.signal.aborted) return; // aborted => abort
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                setIsValidAvailable(isClientError(error) ? false : 'error');
            } // try
        })();
        
        
        
        // cleanups:
        return () => {
            abortController.abort();
        };
    }, [value, currentValue, isValidLength, isValidFormat]);
    
    // validate not_prohibited:
    useEffect(() => {
        // conditions:
        if (prohibitedHint === undefined) return;
        if (!onCheckNotProhibited       ) return;
        
        if (
            !value
            ||
            !isValidLength
            ||
            !isValidFormat
        ) {
            setIsValidNotProhibited('unknown');
            return;
        } // if
        
        if (value && currentValue && (value.toLowerCase() === currentValue.toLowerCase())) {
            setIsValidNotProhibited(true);
            return;
        } // if
        
        
        
        // setups:
        const abortController = new AbortController();
        (async () => {
            try {
                // delay a brief moment, waiting for the user typing:
                setIsValidNotProhibited('unknown');
                await new Promise<void>((resolved) => {
                    setTimeout(() => {
                        resolved();
                    }, 500);
                });
                if (abortController.signal.aborted) return; // aborted => abort
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                setIsValidNotProhibited('loading');
                const result = await onCheckNotProhibited(value);
                if (abortController.signal.aborted) return; // aborted => abort
                if (!isMounted.current) return; // unmounted => abort
                if (!result) {
                    // failed
                    
                    
                    
                    setIsValidNotProhibited(false);
                    return;
                } // if
                
                
                
                // success
                
                
                
                // save the success:
                setIsValidNotProhibited(true);
            }
            catch (error) {
                // failed or error
                
                
                
                if (abortController.signal.aborted) return; // aborted => abort
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                setIsValidNotProhibited(isClientError(error) ? false : 'error');
            } // try
        })();
        
        
        
        // cleanups:
        return () => {
            abortController.abort();
        };
    }, [prohibitedHint, onCheckNotProhibited, value, currentValue, isValidLength, isValidFormat]);
    
    
    
    // validations:
    const specificValidations = {
        isValidLength,
        isValidFormat,
        isValidAvailable,
        isValidNotProhibited,
    };
    const validationMap = {
        Length        : <>Must be {minLength}-{maxLength} characters.</>,
        Format        : formatHint,
        Available     : <>Must have never been registered.</>,
        NotProhibited : ((prohibitedHint !== undefined) && !!onCheckNotProhibited) ? prohibitedHint : undefined,
    };
    
    
    
    // refs:
    const editorRef    = useRef<HTMLInputElement|null>(null);
    const mergedElmRef = useMergeRefs(
        // preserves the original `elmRef` from `editorComponent`:
        editorComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        props.elmRef,
        
        
        
        editorRef,
    );
    
    
    
    // fn props:
    const isEnabled = usePropEnabled(props);
    
    
    
    // jsx:
    return (
        <>
            {/* <TextEditor> */}
            {React.cloneElement<TextEditorProps<TElement>>(editorComponent,
                // props:
                {
                    // other props:
                    ...restEditorProps,
                    ...editorComponent.props, // overwrites restEditorProps (if any conflics)
                    
                    
                    
                    // refs:
                    elmRef   : mergedElmRef,
                    
                    
                    
                    // values:
                    value    : editorComponent.props.value   ?? props.value   ?? value,
                    onChange : handleChange,
                    
                    
                    
                    // validations:
                    required,
                    
                    
                    
                    // states:
                    enabled  : editorComponent.props.enabled ?? props.enabled ?? isEnabled,
                    isValid  : editorComponent.props.isValid ?? props.isValid ?? (
                        (!value && !required)
                        ||
                        (
                            isValidLength
                            &&
                            isValidFormat
                            &&
                            (isValidAvailable === true)
                            &&
                            (((prohibitedHint === undefined) || !onCheckNotProhibited) || (isValidNotProhibited === true))
                        )
                    ),
                    
                    
                    
                    // handlers:
                    onFocus  : handleFocus,
                    onBlur   : handleBlur,
                },
            )}
            <Tooltip
                // variants:
                theme='warning'
                
                
                
                // states:
                expanded={isUserInteracted && isFocused && (required || !!value) && isEnabled}
                
                
                
                // floatable:
                floatingPlacement='top'
                floatingOn={editorRef}
            >
                <List
                    // variants:
                    listStyle='flat'
                >
                    {Object.entries(validationMap).map(([validationType, text], index) => {
                        // conditions:
                        if (!text) return null; // disabled => ignore
                        
                        
                        
                        // fn props:
                        const isValid = (specificValidations as any)?.[`isValid${validationType}`] as (ValidityStatus|undefined);
                        if (isValid === undefined) return null;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={index}
                                
                                
                                
                                // variants:
                                size='sm'
                                theme={getValidityTheme(isValid)}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={getValidityIcon(isValid)}
                                    
                                    
                                    
                                    // variants:
                                    size='sm'
                                />
                                &nbsp;
                                {text}
                            </ListItem>
                        );
                    })}
                </List>
            </Tooltip>
        </>
    );
};
export {
    UniqueEditor,
    UniqueEditor as default,
}
