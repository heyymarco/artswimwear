import { default as React, createContext } from 'react'
import { Container, ContainerProps, ControlProps } from '@reusable-ui/components'



export interface GenericSectionProps
    extends
        ContainerProps,
        ControlProps // fake support for <AccordionItem>'s contentComponent
{
}
/**
 * A generic `<section>` without any `<h1-h6>` or `<article>`.
 * You should manually including at least one `<article>` with appropriate `<h1-h6>`.
 */
export const GenericSection = (props: GenericSectionProps) => {
    // rest props:
    const {
        //#region <Control> props
        // accessibilities:
        tabIndex           : _tabIndex,           // remove
        
        
        
        // states:
        focused            : _focused,            // remove
        assertiveFocusable : _assertiveFocusable, // remove
        arrived            : _arrived,            // remove
        //#endregion <Control> props
        
        
        
        //#region <Indicator> props
        // states:
        enabled         : _enabled,         // remove
        inheritEnabled  : _inheritEnabled,  // remove
        
        active          : _active,          // remove
        inheritActive   : _inheritActive,   // remove
        
        readOnly        : _readOnly,        // remove
        inheritReadOnly : _inheritReadOnly, // remove
        //#endregion <Indicator> props
    ...restContainerProps} = props; // fake support for <AccordionItem>'s contentComponent
    
    
    
    // jsx:
    return (
        <Container
            // rest props:
            {...restContainerProps}
            
            
            
            // semantics:
            tag={props.tag ?? 'section'}
        />
    );
}



export interface IArticleContext {
    level : number
}
export const ArticleContext = createContext<IArticleContext>({
    level : 1,
});
