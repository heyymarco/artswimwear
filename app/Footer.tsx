import {
    type ContainerProps,
    Container,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



export const Footer = (props: ContainerProps) => {
    return (
        <Container {...props} tag='footer' className='siteFooter' theme='primary' mild={false} gradient={true}>
            <div className='content'>
                <p>
                    Copyright 2023 © ArtSwimwear.com
                </p>
            </div>
        </Container>
    );
}
