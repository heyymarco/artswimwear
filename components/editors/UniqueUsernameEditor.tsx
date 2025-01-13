// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// stores:
import {
    // hooks:
    useAvailableUsername,
    useNotProhibitedUsername,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    // types:
    type CheckAvailableHandler,
    type CheckNotProhibitedHandler,
    
    
    
    // react components:
    type UniqueEditorProps,
    UniqueEditor,
}                           from '@/components/editors/UniqueEditor'

// configs:
import {
    credentialsConfigClient,
}                           from '@/credentials.config.client'



// react components:
export interface UniqueUsernameEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        UniqueEditorProps<TElement>
{
}
const UniqueUsernameEditor = <TElement extends Element = HTMLSpanElement>(props: UniqueUsernameEditorProps<TElement>): JSX.Element|null => {
    // stores:
    const [availableUsername    ] = useAvailableUsername();
    const [notProhibitedUsername] = useNotProhibitedUsername();
    
    
    
    // handlers:
    const handleDefaultCheckAvailable     = useEvent<CheckAvailableHandler>((value) => {
        return availableUsername(value).unwrap();
    });
    const handleDefaultCheckNotProhibited = useEvent<CheckNotProhibitedHandler>((value) => {
        return notProhibitedUsername(value).unwrap();
    });
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Username',
        
        
        
        // validations:
        required                 = false, // allows account without username
        
        minLength                = credentialsConfigClient.username.minLength,
        maxLength                = credentialsConfigClient.username.maxLength,
        
        pattern                  = credentialsConfigClient.username.format,
        
        onCheckAvailable         = handleDefaultCheckAvailable,
        onCheckNotProhibited     = handleDefaultCheckNotProhibited,
        
        patternHint              = credentialsConfigClient.username.formatHint,
        prohibitedHint           = credentialsConfigClient.username.prohibitedHint,
        
        
        
        // formats:
        type                     = 'text',
        autoComplete             = 'nope',
        
        
        
        // other props:
        ...restUniqueEditorProps
    } = props satisfies NoForeignProps<typeof props, UniqueEditorProps<TElement>>;
    
    
    
    // jsx:
    return (
        <UniqueEditor<TElement>
            // other props:
            {...restUniqueEditorProps}
            
            
            
            // accessibilities:
            aria-label           = {ariaLabel}
            
            
            
            // validations:
            required             = {required}
            
            minLength            = {minLength}
            maxLength            = {maxLength}
            
            pattern              = {pattern}
            
            onCheckAvailable     = {onCheckAvailable}
            onCheckNotProhibited = {onCheckNotProhibited}
            
            patternHint          = {patternHint}
            prohibitedHint       = {prohibitedHint}
            
            
            
            // formats:
            type                 = {type}
            autoComplete         = {autoComplete}
        />
    );
};
export {
    UniqueUsernameEditor,            // named export for readibility
    UniqueUsernameEditor as default, // default export to support React.lazy
}
