'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook


// reusable-ui components:
import {
    // layout-components:
    CardBody,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals:
import {
    MessageLoading,
}                           from '@/components/MessageLoading'
import {
    MessageError,
}                           from '@/components/MessageError'



// styles:
export const useModalLoadingErrorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'm3u0ci5xdm' , specificityWeight: 2});



// react components:
export interface ModalLoadingErrorProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>
    extends
        // bases:
        ModalCardProps<TElement, TModalExpandedChangeEvent>
{
    // data:
    isFetching : boolean
    isError    : boolean
    refetch    : () => void
}
export const ModalLoadingError = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>(props: ModalLoadingErrorProps<TElement, TModalExpandedChangeEvent>): JSX.Element|null => {
    // styles:
    const styleSheet = useModalLoadingErrorStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        isFetching,
        isError,
        refetch,
    ...restModalCardProps} = props;
    
    
    
    // refs:
    const buttonRetryRef = useRef<HTMLButtonElement|null>(null);
    
    
    
    // jsx:
    if (!isFetching && !isError) return null;
    return (
        <ModalCard<TElement, TModalExpandedChangeEvent>
            // other props:
            {...restModalCardProps}
            
            
            
            // variants:
            theme={props.theme ?? (isError ? 'danger' : undefined)}
            backdropStyle={props.backdropStyle ?? 'interactive'}
            
            
            
            // states:
            expanded={props.expanded ?? true}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? (isError ? buttonRetryRef : undefined)}
        >
            <CardBody
                // classes:
                className={styleSheet.main}
            >
                {isFetching && <MessageLoading />}
                
                {isError    && <MessageError buttonRetryRef={buttonRetryRef} onRetry={refetch} />}
            </CardBody>
        </ModalCard>
    );
};