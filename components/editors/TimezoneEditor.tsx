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



// types:
const possibleValues = [
    -1      * 60,
    -10     * 60,
    -11     * 60,
    -2      * 60,
    -3      * 60,
    -3.5    * 60,
    -4      * 60,
    -5      * 60,
    -6      * 60,
    -7      * 60,
    -8      * 60,
    -9      * 60,
    -9.5    * 60,
    0       * 60,
    1       * 60,
    10      * 60,
    10.5    * 60,
    11      * 60,
    12      * 60,
    13      * 60,
    13.75   * 60,
    14      * 60,
    2       * 60,
    3       * 60,
    3.5     * 60,
    4       * 60,
    4.5     * 60,
    5       * 60,
    5.5     * 60,
    5.75    * 60,
    6       * 60,
    6.5     * 60,
    7       * 60,
    8       * 60,
    8.75    * 60,
    9       * 60,
    9.5     * 60,
];



// utilities:
export const convertTimezoneToReadableClock = (timezone: number): string => {
    const timezoneAbs       = Math.abs(timezone);
    const timezoneHours     = Math.floor(timezoneAbs / 60);
    const timezoneMinutes   = Math.round(timezoneAbs - (timezoneHours * 60));
    return `${(timezone >= 0) ? '+' : '-'}${(timezoneHours < 10) ? '0' : ''}${timezoneHours}:${(timezoneMinutes < 10) ? '0' : ''}${timezoneMinutes}`;
};



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
        defaultValue = (0 - (new Date()).getTimezoneOffset()),
        value : controlledValue,
        onChange,
    ...restTabProps} = props;
    
    
    
    // states:
    const [uncontrolledValue, setUncontrolledValue] = useState<number>(defaultValue);
    const value = controlledValue ?? uncontrolledValue;
    const isControllableValue = (controlledValue !== undefined);
    
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
            {possibleValues.map((timezoneOption) =>
                <ListItem
                    // identifiers:
                    key={timezoneOption}
                    
                    
                    
                    // states:
                    active={value === timezoneOption}
                    onClick={() => {
                        if (!isControllableValue) setUncontrolledValue(timezoneOption);
                        onChange?.(timezoneOption);
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
