// cssfn:
import {
    style,
    children,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
export const usesSimpleEditModelDialogLayout = () => {
    return style({
        display: 'grid',
        gridTemplate: [[
            '"editor     editor"', 'auto',
            '"btnSave btnCancel"', 'auto',
            '/',
            '1fr', '1fr'
        ]],
        gapInline: '0.5rem',
        gapBlock : '1rem',
        ...children('.editor', {
            gridArea: 'editor',
            
            boxSizing: 'content-box',
            minInlineSize: '20em',
        }),
        ...children('.btnSave', {
            gridArea: 'btnSave',
        }),
        ...children('.btnCancel', {
            gridArea: 'btnCancel',
        }),
    });
};

export default () => style({
    // layouts:
    ...usesSimpleEditModelDialogLayout(),
});
