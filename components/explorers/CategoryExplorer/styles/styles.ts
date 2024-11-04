// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    headings,
    
    
    
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
        // width:
        inlineSize        : 'auto',
        insetInlineEnd    : 0, // fill the entire screen width
        
        // height:
        ...rule('.mobile', {
            blockSize     : 'auto',
            insetBlockEnd : 0, // fill the entire screen height, excluding the <Navbar>'s height
        }),
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
        overflow: 'auto', // shows a scrollbar when the available screen space is less than the minimum required layout
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
        [paddingVars.paddingBlock]: `calc(${spacers.md} + 1lh + ${spacers.sm})`, // already reserved to nav
        
        
        
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
            `"... ....... ..." ${spacers.md}`,
            '"nav     nav nav" 1lh',
            `"... ....... ..." ${spacers.sm}`,
            '"... gallery ..." auto',
            '/',
            `${containers.paddingInline} 1fr ${containers.paddingInline}`,
        ]],
        alignContent: 'start', // place the excess space on the bottom
        
        
        
        // borders:
        [borderVars.borderStartStartRadius] : '0px',
        [borderVars.borderStartEndRadius  ] : '0px',
        [borderVars.borderEndStartRadius  ] : '0px',
        [borderVars.borderEndEndRadius    ] : '0px',
        
        [borderVars.borderWidth           ] : '0px',
        
        
        
        // spacings:
        paddingInline: '0px',
        [paddingVars.paddingBlock]: `calc((${spacers.sm} * 2) + 1lh)`, // already reserved to nav
        paddingBlockStart: '0px', // already reserved to nav
    });
};
const usesRootMergeSubLayout = () => {
    return style({
        // positions:
        gridArea: 'root / root / sub / sub',
        
        
        
        // children:
        ...children('*', { // <CategoryExplorerSub>
            ...children('*', { // <GalleryBodyWrapper>
                // children:
                ...children(':is(ul, [role="list"])', { // <GalleryBody>
                    // layouts:
                    alignContent : 'center', // an appearance adjusment when the <CategoryExplorerSubItem>(s) are too few => place the extra spacing at the top and bottom
                }),
            }),
        }),
    });
};

const usesNavLayout = () => {
    return style({
        // positions:
        gridArea: 'nav',
        
        
        
        // layouts:
        display: 'grid',
        gridTemplate: [[
            '"back ... close" auto',
            '/',
            'max-content 1fr max-content',
        ]],
        alignItems : 'center',
        
        
        
        // spacings:
        paddingInline : spacers.md, // already reserved to nav
        
        
        
        // typos:
        fontSize: buttonIcons.fontSizeMd,
        
        
        
        // children:
        ...children('.back', {
            gridArea: 'back',
        }),
        ...children('.close', {
            gridArea: 'close',
        }),
    });
};
const usesListGalleryLayout = () => {
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // children:
        ...children('*', { // <GalleryBodyWrapper>
            // children:
            
            //#region hides the paragraph(s), the heading seems sufficient to display the information
            // minimize the <ModalCard>'s content to minimize the minInlineSize requirement
            ...children('*>[role="dialog"]', {
                ...children('*', { // <Popup>
                    ...children('*', { // <Card>
                        ...children('.body', {
                            // spacings:
                            [paddingVars.paddingInline] : spacers.md,
                            [paddingVars.paddingBlock ] : spacers.sm,
                            
                            
                            
                            // children:
                            ...children(['h1', 'h2', 'h3', 'h4', 'h5'], {
                                // typos:
                                fontSize: headings.fontSize6, // downgrade h1-h4 to h7
                            }),
                            ...children('p', {
                                display: 'none',
                            }),
                        }),
                    }),
                }),
            }),
            //#endregion hides the paragraph(s), the heading seems sufficient to display the information
            
            ...children(':is(ul, [role="list"])', { // <GalleryBody>
                // sizes:
                minBlockSize : '6rem', // limits the minimum height to make loading|error popup have enough space
            }),
        }),
    });
};
const usesSubGalleryLayout = () => {
    return style({
        // positions:
        gridArea: 'gallery',
        
        
        
        // children:
        ...children('*', { // <GalleryBodyWrapper>
            // children:
            ...children(':is(ul, [role="list"])', { // <GalleryBody>
                // children:
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
    }, { specificityWeight: 2 }),
    
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
    scope('rootMergeSub', {
        // layouts:
        ...usesRootMergeSubLayout(),
    }, { specificityWeight: 2 }), // higher specificity than root|sub
    
    scope('nav', {
        // layouts:
        ...usesNavLayout(),
    }),
    scope('listGallery', {
        // layouts:
        ...usesListGalleryLayout(),
    }, { specificityWeight: 2 }), // higher specificity than <PaginationList>|<PaginationGallery>'s style
    scope('subGallery', {
        // layouts:
        ...usesSubGalleryLayout(),
    }),
];
