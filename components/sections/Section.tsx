import { default as React, useContext, useMemo } from 'react'
import type { Tag } from '@reusable-ui/core'
import { Container, Generic } from '@reusable-ui/components'
import { ArticleContext, GenericSection, GenericSectionProps, IArticleContext } from './GenericSection';



export interface SectionProps extends GenericSectionProps {
    // title:
    titleTag ?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'
    title    ?: React.ReactNode
    
    
    
    // content:
    children ?: React.ReactNode
}
/**
 * A simple `<section>` with built-in `<h2>` and `<article>`.
 */
export const Section = (props: SectionProps) => {
    // contexts:
    const { level } = useContext(ArticleContext);
    
    
    
    // rest props:
    const {
        // title:
        titleTag = `h${level}` as Tag,
        title,
        
        
        
        // content:
        children : content,
    ...restGenericSectionProps} = props;
    
    
    
    // jsx:
    const subContextProp = useMemo<IArticleContext>(() => ({
        level: Math.min(6, level + 1), // limits the level to max 6
    }), [level]);
    return (
        <GenericSection
            // other props:
            {...restGenericSectionProps}
        >
            {/* a built-in <article> as the content */}
            <Container
                // semantics:
                tag='article'
                
                
                
                // variants:
                mild='inherit'
                
                
                
                // classes:
                className='fill-self'
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
        </GenericSection>
    );
}
