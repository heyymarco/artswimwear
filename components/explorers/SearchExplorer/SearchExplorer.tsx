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
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    ContainerProps,
    Container,
    
    
    
    // simple-components:
    CloseButton,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// private components:
import {
    RouterUpdater,
}                           from './RouterUpdater'
import {
    SearchExplorerQuery,
}                           from './SearchExplorerQuery'



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
    
    
    
    // handlers:
    onNavigate     ?: ((url: string) => void) | null|undefined
    onClose        ?: ((navigated: boolean) => void)   
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
        
        
        
        // handlers:
        onNavigate,
        onClose,
        
        
        
        // other props:
        ...restSearchExplorerProps
    } = props;
    
    
    
    // styles:
    const styles = useSearchExplorerStyleSheet();
    
    
    
    // handlers:
    const handleClose = useEvent(() => {
        onClose?.(false);
    });
    
    
    
    // default props:
    const {
        // variants:
        theme     = 'primaryAlt',
        
        
        
        // classes:
        className = `${styles.main} ${mobileLayout ? 'mobile' : ''}`,
        
        
        
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
            <RouterUpdater
                // handlers:
                onClose={onClose}
            />
            
            
            
            {!mobileLayout && <CloseButton
                // variants:
                theme='primary'
                mild={true}
                
                
                
                // classes:
                className='close'
                
                
                
                // handlers:
                onClick={handleClose}
            />}
            
            <SearchExplorerQuery
                // refs:
                searchInputRef={searchInputRef}
                
                
                
                // handlers:
                onNavigate={onNavigate}
            />
        </Container>
    );
};
export {
    SearchExplorer,
    SearchExplorer as default,
}
