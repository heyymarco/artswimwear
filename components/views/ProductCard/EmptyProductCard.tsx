'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useProductCardStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // base-components:
    type BasicProps,
    Basic,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface EmptyProductCardProps
    extends
        // bases:
        BasicProps
{
    // accessibilities:
    emptyText ?: string
}
const EmptyProductCard = (props: EmptyProductCardProps): JSX.Element|null => {
    // props:
    const {
        // accessibilities:
        emptyText = 'There are no products.',
        
        
        
        // other props:
        ...restEmptyProductCardProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useProductCardStyleSheet();
    
    
    
    // default props:
    const {
        // variants:
        theme      = 'secondary',
        mild       = false,
        
        
        
        // classes:
        className  = '',
        
        
        
        // other props:
        ...restBasicProps
    } = restEmptyProductCardProps;
    
    
    
    // jsx:
    return (
        <Basic
            // other props:
            {...restBasicProps}
            
            
            
            // variants:
            theme={theme}
            mild={mild}
            
            
            
            // classes:
            className={`${styleSheet.main} ${styleSheet.empty} empty ${className}`}
        >
            {/* #region just for preserving the consistent size to regular <ProductCard> */}
            <div
                // classes:
                className='prodImg'
            />
            <div
                // classes:
                className='header'
            >
                <span
                    // classes:
                    className='name h6'
                />
                <span
                    // classes:
                    className='price h6'
                />
            </div>
            {/* #endregion just for preserving the consistent size to regular <ProductCard> */}
            
            <p className='emptyMessage txt-sec'>
                {emptyText}
            </p>
        </Basic>
    );
};
export {
    EmptyProductCard,            // named export for readibility
    EmptyProductCard as default, // default export to support React.lazy
}
