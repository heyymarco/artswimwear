import { default as React, useContext, useMemo } from 'react'
import type { Tag } from '@reusable-ui/core'
import { Container, ContainerProps, Generic } from '@reusable-ui/components'
import { ArticleContext, GenericSection, GenericSectionProps, IArticleContext } from './GenericSection';



export interface ArticleProps<TElement extends Element = HTMLElement>
    extends
        ContainerProps<TElement>
{
    // title:
    titleTag ?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'
    title    ?: React.ReactNode
}
export const Article = (props: ArticleProps) => {
    // contexts:
    const { level } = useContext(ArticleContext);
    
    
    
    // rest props:
    const {
        // title:
        titleTag = `h${level}` as Tag,
        title,
        
        
        
        // content:
        children : content,
    ...restContainerProps} = props;
    
    
    
    // jsx:
    const subContextProp = useMemo<IArticleContext>(() => ({
        level: Math.min(6, level + 1), // limits the level to max 6
    }), [level]);
    return (
        <Container
            // rest props:
            {...restContainerProps}
            
            
            
            // semantics:
            tag={props.tag ?? 'article'}
            
            
            
            // variants:
            mild={props.mild ?? 'inherit'}
            
            
            
            // classes:
            className={props.className ?? 'fill-self'}
        >
            {/* the article title (if provided) */}
            {title && <Generic tag={titleTag}>
                {title}
            </Generic>}
            
            
            
            {/* the article content within `ArticleContext` */}
            <ArticleContext.Provider value={subContextProp}>
                {content}
            </ArticleContext.Provider>
        </Container>
    );
}



export interface SectionProps extends GenericSectionProps, ArticleProps {
    // components:
    articleComponent ?: React.ReactComponentElement<any, ArticleProps>
    
    
    
    // content:
    children ?: React.ReactNode
}
/**
 * A simple `<section>` with built-in `<h2>` and `<article>`.
 */
export const Section = (props: SectionProps) => {
    // rest props:
    const {
        // title:
        titleTag,
        title,
        
        
        
        // components:
        articleComponent = (<Article /> as React.ReactComponentElement<any, ArticleProps>),
        
        
        
        // content:
        children : content,
    ...restGenericSectionProps} = props;
    
    
    
    // jsx:
    return (
        <GenericSection
            // other props:
            {...restGenericSectionProps}
        >
            {/* <Article> */}
            {React.cloneElement<ArticleProps>(articleComponent,
                // props:
                {
                    // title:
                    titleTag,
                    title,
                },
                
                
                
                // children:
                content,
            )}
        </GenericSection>
    );
}
