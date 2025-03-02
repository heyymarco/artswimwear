'use client'

import {
    type ContainerProps,
    Container,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// states:
import {
    useScrollerState,
}                           from '@/states/scrollerState'



export const Footer = (props: ContainerProps) => {
    // states:
    const {
        // refs:
        footerRef,
    } = useScrollerState();
    
    
    
    return (
        <Container {...props} elmRef={footerRef} tag='footer' className='siteFooter' theme='primary' mild={false} gradient={true}>
            <div className='content'>
                <p>
                    Copyright 2023 © ArtSwimwear.com
                </p>
            </div>
        </Container>
    );
}
