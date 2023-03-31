import { Html, Head, Main, NextScript } from 'next/document'
import { Styles } from '@cssfn/cssfn-react'
import { WEBSITE_LANGUAGE } from '@/website.config'



export default function Document() {
    return (
        <Html lang={WEBSITE_LANGUAGE}>
            <Head>
                <Styles />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
