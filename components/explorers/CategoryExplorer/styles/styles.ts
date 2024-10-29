// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    containers,
    
    
    
    // simple-components:
    buttonIcons,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// defaults:
const minImageSize   = 255; // 255px



// styles:
const usesDropdownLayout = () => {
    return style({
        inlineSize : '100%',
    });
};

const usesMainLayout = () => {
    return style({
        // layouts:
        display: 'grid',
        gridTemplate: [[
            '"root sub" auto',
            '/',
            '1fr 3fr',
        ]],
    });
};

const usesRootLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder({ borderWidth: '0px' });
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // positions:
        gridArea: 'root',
        
        
        
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        paddingInlineEnd: '0px',
        [paddingVars.paddingBlock]: `calc((${spacers.sm} * 2) + 1lh)`, // already reserved to nav
        
        
        
        // borders:
        [borderVars.borderStartStartRadius] : '0px',
        [borderVars.borderStartEndRadius  ] : '0px',
        [borderVars.borderEndStartRadius  ] : '0px',
        [borderVars.borderEndEndRadius    ] : '0px',
        
        [borderVars.borderWidth           ] : '0px',
        
        
        
        // sizes:
        ...children('*', { // <PaginationList>
            ...children('*', { // <GalleryBodyWrapper>
                ...children('ul', { // <GalleryBody>
                    // spacings:
                    gap: spacers.sm, // a space between <CategoryExplorerRootItem>(s)
                }, { specificityWeight: 2 }),
            }),
        }),
    });
};
const usesSubLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder({ borderWidth: '0px' });
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // positions:
        gridArea: 'sub',
        
        
        
        // layouts:
        display: 'grid',
        gridTemplate: [[
            `"... ......." ${spacers.sm}`,
            '"nav     nav" 1lh',
            `"... ......." ${spacers.sm}`,
            '"... gallery" auto',
            '/',
            `${containers.paddingInline} 1fr`,
        ]],
        
        
        
        // borders:
        [borderVars.borderStartStartRadius] : '0px',
        [borderVars.borderStartEndRadius  ] : '0px',
        [borderVars.borderEndStartRadius  ] : '0px',
        [borderVars.borderEndEndRadius    ] : '0px',
        
        [borderVars.borderWidth           ] : '0px',
        
        
        
        // spacings:
        paddingInlineStart: '0px',
        [paddingVars.paddingBlock]: `calc((${spacers.sm} * 2) + 1lh)`, // already reserved to nav
        paddingBlockStart: '0px', // already reserved to nav
    });
};
const usesRootAndSubLayout = () => {
    return style({
        // positions:
        gridArea: 'root / root / sub / sub',
    });
};

const usesNavLayout = () => {
    return style({
        // positions:
        gridArea: 'nav',
        
        
        
        // layouts:
        display: 'grid',
        justifyItems: 'start',
        alignItems : 'center',
        
        
        
        // spacings:
        paddingInlineStart : spacers.sm, // already reserved to nav
        
        
        
        // typos:
        fontSize: buttonIcons.fontSizeMd,
    });
};
const usesSubGalleryLayout = () => {
    return style({
        // positions:
        gridArea: 'gallery',
        
        
        
        // children:
        ...children('*', { // <GalleryBodyWrapper>
            ...children(':is(ul, [role="list"])', { // <GalleryBody>
                alignContent : 'center', // an appearance adjusment when the <CategoryExplorerSubItem>(s) are too few => place the extra spacing at the top and bottom
                ...children('[role="presentation"]', {
                    // layouts:
                    gridTemplateColumns : `repeat(auto-fit, minmax(${minImageSize}px, 1fr))`, // an appearance adjusment when the <CategoryExplorerSubItem>(s) are too few => fill the entire <CategoryExplorerSub> width
                }),
            }),
        }),
    });
};



export default () => [
    scope('dropdown', {
        // layouts:
        ...usesDropdownLayout(),
    }),
    
    scope('main', {
        // layouts:
        ...usesMainLayout(),
    }, { specificityWeight: 2 }),
    
    scope('root', {
        // layouts:
        ...usesRootLayout(),
    }),
    scope('sub', {
        // layouts:
        ...usesSubLayout(),
    }),
    scope('rootAndSub', {
        // layouts:
        ...usesRootAndSubLayout(),
    }, { specificityWeight: 2 }), // higher specificity than root|sub
    
    scope('nav', {
        // layouts:
        ...usesNavLayout(),
    }),
    scope('subGallery', {
        // layouts:
        ...usesSubGalleryLayout(),
    }),
];
