import { default as React, createContext } from 'react'
import { Container, ContainerProps } from '@reusable-ui/components'



export interface GenericSectionProps extends ContainerProps {
}
/**
 * A generic `<section>` without any `<h1-h6>` or `<article>`.
 * You should manually including at least one `<article>` with appropriate `<h1-h6>`.
 */
export const GenericSection = (props: GenericSectionProps) => {
    // jsx:
    return (
        <Container
            // other props:
            {...props}
            
            
            
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
