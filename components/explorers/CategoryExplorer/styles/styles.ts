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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    containers,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



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
            '"rootBefore body subAfter" auto',
            '/',
            '1fr max-content 1fr',
        ]],
    });
};
const usesBodyLayout = () => {
    return style({
        // positions:
        gridArea: 'body',
        
        
        
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
    
    
    
    return style({
        // positions:
        gridArea: 'root',
        
        
        
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        paddingInlineEnd: '0px',
        
        
        
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
                    gap: spacers.sm,
                    
                    
                    
                    // TODO: just a quick fix, should be removed if the <PaginationList>'s separatorHack has been fixed
                    minBlockSize: 'unset',
                }, { specificityWeight: 2 }),
            }),
        }),
    });
};
const usesSubLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder({ borderWidth: '0px' });
    
    
    
    return style({
        // positions:
        gridArea: 'sub',
        
        
        
        // layouts:
        display: 'grid',
        gridTemplate: [[
            `"nav nav " ${containers.paddingBlock}`,
            '"... expl" auto',
            '/',
            `${containers.paddingInline} 1fr`,
        ]],
        
        
        
        // sizes:
        ...children('*', { // <PaginationList>
            ...children('*', { // <GalleryBodyWrapper>
                ...children('ul', { // <GalleryBody>
                    // spacings:
                    gap: spacers.sm,
                    
                    
                    
                    // TODO: just a quick fix, should be removed if the <PaginationList>'s separatorHack has been fixed
                    minBlockSize: 'unset',
                }, { specificityWeight: 2 }),
            }),
        }),
        
        
        
        // borders:
        [borderVars.borderStartStartRadius] : '0px',
        [borderVars.borderStartEndRadius  ] : '0px',
        [borderVars.borderEndStartRadius  ] : '0px',
        [borderVars.borderEndEndRadius    ] : '0px',
        
        [borderVars.borderWidth           ] : '0px',
        
        
        
        // spacings:
        paddingInlineStart: '0px',
        paddingBlockStart: '0px',
    });
};

const usesRootBeforeLayout = () => {
    return style({
        // positions:
        gridArea: 'rootBefore',
    })
};
const usesSubAfterLayout = () => {
    return style({
        // positions:
        gridArea: 'subAfter',
    })
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
        paddingInlineStart: spacers.sm,
    });
};
const usesSubExplLayout = () => {
    return style({
        // positions:
        gridArea: 'expl',
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
    scope('body', {
        // layouts:
        ...usesBodyLayout(),
    }, { specificityWeight: 2 }),
    
    scope('root', {
        // layouts:
        ...usesRootLayout(),
    }),
    scope('sub', {
        // layouts:
        ...usesSubLayout(),
    }),
    
    scope('rootBefore', {
        // layouts:
        ...usesRootBeforeLayout(),
    }),
    scope('subAfter', {
        // layouts:
        ...usesSubAfterLayout(),
    }),
    
    scope('nav', {
        // layouts:
        ...usesNavLayout(),
    }),
    scope('subExpl', {
        // layouts:
        ...usesSubExplLayout(),
    }),
];
