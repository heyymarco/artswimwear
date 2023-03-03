import { GenericSection } from '@/components/sections/GenericSection';
import { children, fallbacks, style, variants } from '@cssfn/core';
import { dynamicStyleSheet } from '@cssfn/cssfn-react';
import { containers } from '@reusable-ui/components';
import { borders, colors, ifScreenWidthAtLeast, usesThemable } from '@reusable-ui/core';
import type { NextPage } from 'next'
import Head from 'next/head'



const useSheet = dynamicStyleSheet(() => {
    const {themableVars} = usesThemable();
    
    return style({
        ...style({
            display: 'grid',
            gridTemplate: [[
                '"illus shared content"', '1fr',
                '/',
                '2fr', '1fr', '1fr'
            ]],
            justifyItems: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            height:     `calc(100svh - var(--site-header) - var(--site-footer))`,
            ...fallbacks({
                height: `calc(100dvh - var(--site-header) - var(--site-footer))`,
            }),
            ...fallbacks({
                height: `calc(100vh  - var(--site-header) - var(--site-footer))`,
            }),

            borderBlockStartWidth: borders.hair,
            borderColor: themableVars.backg,

            ...children('.illustration', {
                gridArea: 'illus/illus / content/content',

                position: 'absolute', // do not taking space
                // justifySelf: 'stretch',
                // alignSelf: 'stretch',
                // width: '100%',
                // height: '100%',
                inlineSize: `calc(100% + (2 * ${containers.paddingInline}))`,
                blockSize: `calc(100% + (2 * ${containers.paddingBlock}))`,
                objectFit: 'contain',
                objectPosition: '50% 35%',
            }),
            ...children('article', {
                gridArea: 'shared/shared / content/content',
                alignSelf: 'end',

                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',

                backgroundImage: [
                    `linear-gradient(${colors.secondaryThin}, ${colors.secondaryThin})`,
                    'linear-gradient(rgba(255,255,255, 0.2), rgba(255,255,255, 0.2))'
                ],
                border: `solid 1px ${colors.white}`,
                backdropFilter: [['blur(10px)']],
                filter: [[`drop-shadow(0px 0px 10px ${colors.secondaryBold})`]],

                paddingInline: containers.paddingInline,
                paddingBlock: containers.paddingBlock,

                // marginInline: `calc(0px - ${containers.paddingInline})`,
                // marginBlock: `calc(0px - ${containers.paddingBlock})`,
                // inlineSize: `calc(100% + (2 * ${containers.paddingInline}))`
                inlineSize: '100%',
            }),
        }),
        ...variants([
            ifScreenWidthAtLeast('sm', {
                // background: 'red',
                gridTemplateColumns: [['1fr', '1fr', '1fr']],
                gridTemplateRows: [['1fr']],
                gridTemplateAreas: [[
                    '"illus shared content"',
                ]],

                ...children('.illustration', {
                    gridArea: 'illus/illus / shared/shared',
                }),
                ...children('article', {
                    gridArea: 'shared/shared / content/content',
                }),
            })
        ]),
    });
}, { id: 'under-const', specificityWeight: 2 });



const Page : NextPage = () => {
    const sheet = useSheet();

    return (<>
        <Head>
            <title>Under Construction</title>
            <meta name="description" content="Sorry, this page is under construction or maintenance." />
        </Head>
        <GenericSection className={sheet.main} theme='primary' mild={true}>
            <img className='illustration' src='/under-construction.svg' alt='' />
            <article>
                <h1>
                    Under Construction
                </h1>
                <p className='lead'>
                    Sorry, this page is under construction or maintenance.
                </p>
                <p className='lead'>
                    Please come back later 😋
                </p>
            </article>
        </GenericSection>
    </>);
}
export default Page;
