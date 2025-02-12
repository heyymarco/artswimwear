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
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    containers,
    
    
    
    // menu-components:
    usesCollapse,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usesDropdownLayout = () => {
    // dependencies:
    
    // features:
    const {collapseVars} = usesCollapse();
    
    
    
    return style({
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
        // animating height (desktop only):
        ...rule(':not(.mobile)', {
            [collapseVars.blockSize ] : 'calc(100dvh - var(--site-header, 0px))',
        }),
    });
};

const usesMainLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder({ borderWidth: '0px' });
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // layouts:
        display: 'grid',
        gridTemplate: [[
            `"..... ....... ....... ....... ....... ....." ${spacers.md}`,
            '"..... ....... search  .......   close close" 1lh',
            '"..... ....... search  ....... ....... ....." max-content',
            `"..... ....... ....... ....... ....... ....." ${spacers.md}`,
            '"..... results results results results ....." 1fr',
            '/',
            `calc(${containers.paddingInline} - ${spacers.md}) ${spacers.md} 1fr ${spacers.md} ${spacers.md} calc(${containers.paddingInline} - ${spacers.md})`,
        ]],
        ...rule('.mobile', {
            gridTemplate: [[
                `"..... ....... ....." ${spacers.md}`,
                '"..... search  ....." 1lh',
                '"..... search  ....." max-content',
                `"..... ....... ....." ${spacers.md}`,
                '"..... results ....." 1fr',
                '/',
                `${containers.paddingInline} 1fr ${containers.paddingInline}`,
            ]],
        }),
        alignItems : 'center',
        ...rule(':not(.mobile)', {       // desktop mode
            overflowY      : 'auto',     // shows a scrollbar when a lot of menuItems are flooded the limited <Dropdown>'s height (unstable width)
            scrollbarWidth : 'none',     // no scrollbar if possible, the vertical scrollbar causing the dropdown animation seems ugly
        }),
        ...rule('.mobile', {             // mobile mode
            overflowY      : 'scroll',   // shows a scrollbar when a lot of menuItems are flooded the limited <Dropdown>'s height (stable width)
            scrollbarWidth : 'none',     // no scrollbar if possible
        }),
        
        
        
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
        ...children('.close', {
            gridArea: 'close',
            justifySelf: 'end',
            marginInlineEnd: spacers.md,
        }),
        
        ...children('.search', {
            gridArea: 'search',
            
            
            
            // layouts:
            display: 'grid',
        }),
        ...children('.results', {
            gridArea: 'results',
            
            
            
            // layouts:
            display      : 'grid',
            alignContent : 'start',
            
            
            
            // scrolls:
            overflow     : 'hidden',
            
            
            
            // sizes:
            alignSelf    : 'stretch',
            
            
            
            // children:
            ...children('.body', {
                padding : spacers.md,
            }),
        }),
    });
};

const usesGalleryLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars } = usesBorder();
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // borders:
        // discard border stroke:
        [borderVars.borderWidth           ] : '0px',
        
        // discard borderRadius:
        // remove rounded corners on top:
        [borderVars.borderStartStartRadius] : '0px',
        [borderVars.borderStartEndRadius  ] : '0px',
        // remove rounded corners on bottom:
        [borderVars.borderEndStartRadius  ] : '0px',
        [borderVars.borderEndEndRadius    ] : '0px',
        
        
        
        // spacings:
        padding: 0,                               // remove the actual padding, but:
        [paddingVars.paddingInline] : spacers.md, // simulate having a wider padding, so the <GalleryLayout> copies the padding
        [paddingVars.paddingBlock ] : spacers.md, // simulate having a wider padding, so the <GalleryLayout> copies the padding
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
    scope('gallery', {
        // layouts:
        ...usesGalleryLayout(),
    }, { specificityWeight: 3 }),
];
