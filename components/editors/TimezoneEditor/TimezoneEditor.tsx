// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // layout-components:
    ListItem,
    
    
    
    // menu-components:
    DropdownListExpandedChangeEvent,
    DropdownListButtonProps,
    DropdownListButton,
}                           from '@reusable-ui/components'
import {
    possibleTimezoneValues,
}                           from './types'
import {
    convertTimezoneToReadableClock,
}                           from './utilities'



// react components:
interface TimezoneEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, number>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        Omit<DropdownListButtonProps,
            // states:
            |'defaultExpandedTabIndex' // already taken over
            |'expandedTabIndex'        // already taken over
            |'onExpandedChange'        // already taken over
            
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            // children:
            |'children'                // already taken over
        >
{
}
const TimezoneEditor = <TElement extends Element = HTMLElement>(props: TimezoneEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue : defaultUncontrollableValue = (0 - (new Date()).getTimezoneOffset()),
        value        : controllableValue,
        onChange     : onControllableValueChange,
    ...restTabProps} = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<number>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const [expanded, setExpanded] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<DropdownListExpandedChangeEvent>>(({expanded}) => {
        setExpanded(expanded);
    });
    
    
    
    // jsx:
    return (
        <DropdownListButton
            // other props:
            {...restTabProps}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Timezone'}
            
            
            
            // states:
            expanded={expanded}
            onExpandedChange={handleExpandedChange}
            
            
            
            // children:
            buttonChildren={
                <>
                    UTC{convertTimezoneToReadableClock(value)}
                </>
            }
        >
            {possibleTimezoneValues.map((timezoneOption) =>
                <ListItem
                    // identifiers:
                    key={timezoneOption}
                    
                    
                    
                    // states:
                    active={value === timezoneOption}
                    onClick={() => {
                        triggerValueChange(timezoneOption, { triggerAt: 'immediately' });
                    }}
                >
                    UTC{convertTimezoneToReadableClock(timezoneOption)}
                </ListItem>
            )}
        </DropdownListButton>
    );
};
export {
    TimezoneEditor,
    TimezoneEditor as default,
}
