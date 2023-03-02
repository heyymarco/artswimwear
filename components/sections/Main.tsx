import { default as React, useMemo } from 'react'
import { Generic } from '@reusable-ui/components'
import { SectionProps } from './Section';
import { ArticleContext, GenericSection, IArticleContext } from './GenericSection';



export interface MainProps extends SectionProps {
}
export const Main = (props: MainProps) => {
    // rest props:
    const {
        // title:
        titleTag = 'h1',
        title,
        
        
        
        // content:
        children : content,
    ...restGenericSectionProps} = props;
    
    
    
    // jsx:
    const subContextProp = useMemo<IArticleContext>(() => ({
        level: 2,
    }), []);
    return (
        <GenericSection
            // other props:
            {...restGenericSectionProps}
            
            
            
            // semantics:
            tag={props.tag ?? 'main'} // the <root-section> as <main-article>
        >
            {/* the article title (if provided) */}
            {title && <Generic tag={titleTag}>
                {title}
            </Generic>}
            
            
            
            {/* the article content within `ArticleContext` */}
            <ArticleContext.Provider value={subContextProp}>
                {content}
            </ArticleContext.Provider>
        </GenericSection>
    );
}
