import { Container } from '@reusable-ui/components'



export const Footer = () => {
    return (
        <Container tag='footer' className='siteFooter' theme='primary' mild={false} gradient={true}>
            <p>
                Copyright 2023 © ArtSwimwear.com
            </p>
        </Container>
    );
}
