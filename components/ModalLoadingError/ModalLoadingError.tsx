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

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

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
    // props:
    const {
        // data:
        isFetching,
        isError,
        refetch,
        
        
        
        // other props:
        ...restModalLoadingErrorProps
    } = props;
    
    
    
    // styles:
    const styles = useModalLoadingErrorStyleSheet();
    
    
    
    // refs:
    const buttonRetryRef = useRef<HTMLButtonElement|null>(null);
    
    
    
    // default props:
    const {
        // variants:
        theme         = (isError ? 'danger' : undefined),
        backdropStyle = 'interactive',
        
        
        
        // states:
        expanded      = true,
        
        
        
        // auto focusable:
        autoFocusOn   = (isError ? buttonRetryRef : undefined),
        autoFocus     =  isError,
        
        
        
        // children:
        children      = (
            <CardBody
                // classes:
                className={styles.main}
            >
                {isFetching && <MessageLoading />}
                
                {isError    && <MessageError buttonRetryRef={buttonRetryRef} onRetry={refetch} />}
            </CardBody>
        ),
        
        
        
        // other props:
        ...restModalCardProps
    } = restModalLoadingErrorProps satisfies NoForeignProps<typeof restModalLoadingErrorProps, ModalCardProps<TElement, TModalExpandedChangeEvent>>;
    
    
    
    // jsx:
    if (!isFetching && !isError) return null;
    return (
        <ModalCard<TElement, TModalExpandedChangeEvent>
            // other props:
            {...restModalCardProps}
            
            
            
            // variants:
            theme={theme}
            backdropStyle={backdropStyle}
            
            
            
            // states:
            expanded={expanded}
            
            
            
            // auto focusable:
            autoFocusOn={autoFocusOn}
            autoFocus={autoFocus}
        >
            {children}
        </ModalCard>
    );
};
