// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    scope,
    
    
    
    // strongly typed of css variables:
    switchOf,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    headings,
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    globalStacks,
    
    
    
    // outlined (background-less) variant of UI:
    usesOutlineable,
    
    
    
    // mild (soft color) variant of UI:
    usesMildable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    containers,
    
    
    
    // simple-components:
    buttonIcons,
    
    
    
    // menu-components:
    usesCollapse,
    dropdowns,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// defaults:
const minImageSize   = 255; // 255px



// styles:
const usesDropdownLayout = () => {
    // dependencies:
    
    // features:
    const {collapseVars} = usesCollapse();
    
    
    
    return style({
        // sizes:
        // width (both desktop and mobile):
        [collapseVars.inlineSize]     : '100%', // overwrites <Dropdown>'s `inlineSize: 'fit-content'`
        // insetInlineEnd             : 0,      // fill the entire screen width (do not use logical mode)
        right                         : 0,      // fill the entire screen width (instead, use physical mode, since the `left` prop is already handled by `useFloatable()`)
        
        // height (mobile only):
        ...rule('.mobile', {
            [collapseVars.blockSize ] : 'auto', // overwrites <Dropdown>'s `blockSize: 'fit-content'` (if the <Dropdown> upgraded in the future)
            // insetBlockEnd          : 0,      // fill the entire screen height, excluding the <Navbar>'s height (do not use logical mode)
            bottom                    : 0,      // fill the entire screen height, excluding the <Navbar>'s height (instead, use physical mode, since the `top` prop is already handled by `useFloatable()`)
        }),
        
        
        
        // animations:
        filter: 'none', // move the filter to <CategoryExplorer>, makes the frost effect work
        
        
        
        // global stackable:
        ...rule('.overlay', {
            zIndex : globalStacks.modalBackdrop, // there's a probability a dialog shown on the top of this dropdown, such as <NotifyWishAddedDialog>, so we need to lower this dropdown's zIndex to dialog's level zIndex
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
        ...rule(':not(.mobile)', {       // desktop mode
            overflowY      : 'auto',     // shows a scrollbar when a lot of menuItems are flooded the limited <Dropdown>'s height (unstable width)
            scrollbarWidth : 'none',     // no scrollbar if possible, the vertical scrollbar causing the dropdown animation seems ugly
        }),
        ...rule('.mobile', {             // mobile mode
            overflowY      : 'scroll',   // shows a scrollbar when a lot of menuItems are flooded the limited <Dropdown>'s height (stable width)
            scrollbarWidth : 'none',     // no scrollbar if possible
        }),
        
        
        
        // backgrounds:
        backdropFilter: [
            ['blur(10px)'],
        ],
        
        
        
        // animations:
        filter : dropdowns.filter, // move the filter to <CategoryExplorer>, makes the frost effect work
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
        
        
        
        // children:
        ...rule('.mobile', {
            ...children('*', { // <CategoryExplorerSub>
                ...children('*', { // <GalleryBodyWrapper>
                    // children:
                    ...children(':is(ul, [role="list"])', { // <GalleryBody>
                        ...children('[role="presentation"]', { // <GalleryGrid>
                            gridTemplateColumns : '1fr', // force to always SINGLE_COLUMN when on mobile layout
                        }),
                    }),
                }),
            }),
        }),
    });
};
const usesRootMergeSubLayout = () => { // no <CategoryExplorerRoot>, just a <CategoryExplorerSub> takes over the <CategoryExplorerRoot>
    return style({
        // positions:
        gridArea: 'root / root / sub / sub',
        
        
        
        // children:
        ...rule(':not(.mobile)', {
            ...children('*', { // <CategoryExplorerSub>
                ...children('*', { // <GalleryBodyWrapper>
                    // children:
                    ...children(':is(ul, [role="list"])', { // <GalleryBody>
                        // layouts:
                        alignContent : 'center', // an appearance adjusment when the <CategoryExplorerSubItem>(s) are too few => place the extra spacing at the top and bottom
                    }),
                }),
            }),
        }),
    });
};
const usesSemiTransparentBackground = () => {
    // dependencies:
    
    // features:
    const {backgroundVars } = usesBackground();
    
    // variants:
    const {outlineableVars} = usesOutlineable();
    const {mildableVars   } = usesMildable();
    
    
    
    return style({
        // backgrounds:
        // final color functions:
        [backgroundVars.backgColor] : `color(from ${switchOf(
            outlineableVars.backgTg,        // toggle outlined (if `usesOutlineable()` applied)
            mildableVars.backgTg,           // toggle mild     (if `usesMildable()` applied)
            
            backgroundVars.backgColorFn,    // default => uses our `backgColorFn`
        )} srgb r g b / calc(alpha * 0.8))`,
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
    }, { specificityWeight: 2 }), // overwrite <Dropdown>'s styles
    
    scope('main', {
        // layouts:
        ...usesMainLayout(),
    }),
    
    scope('root', {
        // layouts:
        ...usesRootLayout(),
        ...usesSemiTransparentBackground(),
    }, { specificityWeight: 2 }), // overwrite <CategoryExplorerList>'s styles
    scope('sub', {
        // layouts:
        ...usesSubLayout(),
        ...usesSemiTransparentBackground(),
    }, { specificityWeight: 2 }), // overwrite <CategoryExplorerGallery>'s styles
    scope('rootMergeSub', {
        // layouts:
        ...usesRootMergeSubLayout(),
    }, { specificityWeight: 3 }), // higher specificity than root|sub
    
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
