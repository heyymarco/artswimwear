// cssfn:
import {
    scope,
    children,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
export default () => [
    scope('card', {
        // sizes:
        maxInlineSize : 'fit-content', // the <Card>'s width is only as wide as the content needed
        
        
        
        // children:
        ...children('.body', {
            overflow: 'hidden', // prevents an ugly scrollbar shown when collapsing
            
            
            
            // children:
            ...children('.wrapper', {
                // layouts:
                display: 'grid',
                gridTemplate: [[
                    '"icon content control" auto',
                    '/',
                    'max-content 1fr max-content',
                ]],
                alignItems: 'start',
                
                
                
                // children:
                ...children(['.icon', '.control'], {
                    // spacings:
                    marginBlockEnd: 0,
                }),
                ...children('.icon', {
                    // positions:
                    gridArea: 'icon',
                }),
                ...children('.content', {
                    // positions:
                    gridArea: 'content',
                }),
                ...children('.control', {
                    // positions:
                    gridArea: 'control',
                }),
            }),
        }),
    }, { specificityWeight: 2 }),
];
