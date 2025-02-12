'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useSearchExplorerStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    ContainerProps,
    Container,
    
    
    
    // simple-components:
    CloseButton,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    SearchExplorerQuery,
}                           from './SearchExplorerQuery'
import {
    type CartState,
    ForwardCartStateProvider,
}                           from '@/components/Cart'



// react components:
export interface SearchExplorerProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ContainerProps<TElement>,
            // children:
            |'children' // already defined internally
        >,
        
        // <div>:
        Pick<React.HTMLAttributes<TElement>,
            // accessibilities:
            |'tabIndex'
        >
{
    // refs:
    searchInputRef ?: React.Ref<HTMLInputElement> // setter ref
    
    
    
    // appearances:
    mobileLayout   ?: boolean
    
    
    
    // states:
    cartState       : CartState
    
    
    
    // handlers:
    onNavigate     ?: ((url: string) => void) | null|undefined
    onClose        ?: (() => void)   
}
const SearchExplorer = <TElement extends Element = HTMLElement>(props: SearchExplorerProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // refs:
        searchInputRef,
        
        
        
        // appearances:
        mobileLayout = true,
        
        
        
        // accessibilities:
        tabIndex     = 0,
        
        
        
        // states:
        cartState,
        
        
        
        // handlers:
        onNavigate,
        onClose,
        
        
        
        // other props:
        ...restSearchExplorerProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useSearchExplorerStyleSheet();
    
    
    
    // default props:
    const {
        // variants:
        theme     = 'primaryAlt',
        
        
        
        // classes:
        className = `${styleSheet.main} ${mobileLayout ? 'mobile' : ''}`,
        
        
        
        // other props:
        ...restContainerProps
    } = restSearchExplorerProps satisfies NoForeignProps<typeof restSearchExplorerProps, ContainerProps<TElement>>;
    
    
    
    // jsx:
    return (
        <Container<TElement>
            // other props:
            {...restContainerProps}
            
            
            
            // accessibilities:
            // @ts-ignore
            tabIndex={tabIndex}
            
            
            
            // variants:
            theme={theme}
            
            
            
            // classes:
            className={className}
        >
            {!mobileLayout && <CloseButton
                // variants:
                theme='primary'
                mild={true}
                
                
                
                // classes:
                className='close'
                
                
                
                // handlers:
                onClick={onClose ?? undefined}
            />}
            
            <ForwardCartStateProvider cartState={cartState}>
                <SearchExplorerQuery
                    // refs:
                    searchInputRef={searchInputRef}
                    
                    
                    
                    // handlers:
                    onNavigate={onNavigate}
                />
            </ForwardCartStateProvider>
        </Container>
    );
};
export {
    SearchExplorer,
    SearchExplorer as default,
}
