// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a color management system:
    colorValues,
    
    
    
    // a border (stroke) management system
    borderValues,
    borderRadiusValues,
    
    
    
    // a spacer (gap) management system
    spacerValues,
    
    
    
    // a typography management system:
    typoValues,
    secondaryValues,
    headingValues,
    paragraphValues,
    horzRuleValues,
    
    
    
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    basicValues,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// other libs:
import Color                from 'color'                // color utilities

// configs:
import '@/theme.config'



export const theme = (themeName: ThemeName, gradient: boolean = true) => {
    return {
        // backgrounds:
        ...(gradient ? {
            background          : (basicValues.backgGrad as any)?.[0]?.[0],
            backgroundBlendMode : `${basicValues.backgroundBlendMode}`,
        } : undefined),
        backgroundColor         : colorValues[themeName as keyof typeof colorValues].mix(Color('#ffffff'), 0.5).toString().toLowerCase(),
        
        
        
        // foregrounds:
        color                   : colorValues[`${themeName}Bold` as keyof typeof colorValues].toString().toLowerCase(),
    };
};



export const textSecondary               : React.CSSProperties = {
    // appearances:
    opacity         : `${secondaryValues.opacity}`,
};
export const textSmall                   : React.CSSProperties = {
    // layouts:
    ...textSecondary,
    
    
    
    // positions:
    verticalAlign   : 'middle', // center to normal_size_text
    marginTop       : 'auto',
    marginBottom    : 'auto',
    
    
    
    // typos:
    fontSize        : `calc(0.75 * ${typoValues.fontSizeMd})`,
    // fontWeight      : 'lighter',
};
export const textNormal                  : React.CSSProperties = {
    // positions:
    verticalAlign   : 'middle', // center to normal_size_text
    marginTop       : 'auto',
    marginBottom    : 'auto',
    
    
    
    // typos:
    fontSize        : `calc(1 * ${typoValues.fontSizeMd})`,
    fontWeight      : `${typoValues.fontWeightNormal}`,
};
export const textBold                    : React.CSSProperties = {
    // typos:
    fontWeight      : `${typoValues.fontWeightBold}`,
};
export const textBig                     : React.CSSProperties = {
    // typos:
    fontSize        : `calc(1.25 * ${typoValues.fontSizeMd})`,
};



const horzRuleStroke                     = (themeName: ThemeName = 'primary'): string => (
    `${borderValues.style} ${borderValues.hair} ${colorValues[`${themeName}Bold` as keyof typeof colorValues].mix(Color('#ffffff'), 1 - (Number.parseFloat(`${horzRuleValues.opacity ?? 0.25}`))).toString().toLowerCase()}`
);
export const horzRule                    : React.CSSProperties = {
    // layouts:
    display           : 'block',
    
    
    
    // borders:
    borderLeft        : 0,                // no   left   border
    borderRight       : 0,                // no   right  border
    borderTop         : horzRuleStroke(), // only top    border
    borderBottom      : 0,                // no   bottom border
    
    
    
    // spacings:
    marginLeft        : 0,                    // no    space to left
    marginRight       : 0,                    // no    space to right
    marginTop         : `${spacerValues.md}`, // extra space to top
    marginBottom      : `${spacerValues.md}`, // extra space to bottom
};
export const borderAsHorzRule            : React.CSSProperties = {
    // borders:
    borderBottom      : horzRuleStroke(), // exploits bottom border as horz rule
};



export const borderStroke                = (themeName: ThemeName = 'primary'): string => (
    `${borderValues.style} ${borderValues.hair} ${colorValues[`${themeName}Bold` as keyof typeof colorValues].toString().toLowerCase()}`
);
export const borderAllSides              : React.CSSProperties = {
    // borders:
    border            : borderStroke(),
};
export const borderTopSide               : React.CSSProperties = {
    // borders:
    borderTop         : borderStroke(),
};
export const borderBottomSide            : React.CSSProperties = {
    // borders:
    borderBottom      : borderStroke(),
};
export const borderInlineStartSide       : React.CSSProperties = {
    // borders:
    borderLeft        : borderStroke(), // fallback for GMail
    borderInlineEnd   : 0,            // kills the fallback above
    borderInlineStart : borderStroke(), // ltr/rtl aware
};
export const borderInlineEndSide         : React.CSSProperties = {
    // borders:
    borderRight       : borderStroke(), // fallback for GMail
    borderInlineStart : 0,            // kills the fallback above
    borderInlineEnd   : borderStroke(), // ltr/rtl aware
};



const borderRadiusBase                   = `${borderRadiusValues.md}`;
export const borderRadiusTopSide         : React.CSSProperties = {
    borderTopLeftRadius     : borderRadiusBase, // border radius on top_left
    borderTopRightRadius    : borderRadiusBase, // border radius on top_right
};
export const borderRadiusTopStartSide    : React.CSSProperties = {
    borderTopLeftRadius     : borderRadiusBase, // fallback for GMail
    borderStartEndRadius    : 0,                // kills the fallback above
    borderStartStartRadius  : borderRadiusBase, // ltr/rtl aware
};
export const borderRadiusTopEndSide      : React.CSSProperties = {
    borderTopRightRadius    : borderRadiusBase, // fallback for GMail
    borderStartStartRadius  : 0,                // kills the fallback above
    borderStartEndRadius    : borderRadiusBase, // ltr/rtl aware
};
export const borderRadiusBottomStartSide : React.CSSProperties = {
    borderBottomLeftRadius  : borderRadiusBase, // fallback for GMail
    borderEndEndRadius      : 0,                // kills the fallback above
    borderEndStartRadius    : borderRadiusBase, // ltr/rtl aware
};
export const borderRadiusBottomEndSide   : React.CSSProperties = {
    borderBottomRightRadius : borderRadiusBase, // fallback for GMail
    borderEndStartRadius    : 0,                // kills the fallback above
    borderEndEndRadius      : borderRadiusBase, // ltr/rtl aware
};



export const selfCenterHorz              : React.CSSProperties = {
    // positions:
    // justifySelf  : 'center', // not supported in GMail
    marginLeft      : 'auto',   // the another way to center horizontally
    marginRight     : 'auto',   // the another way to center horizontally
};



export const article : React.CSSProperties = {
    // backgrounds & foregrounds:
    ...theme('secondary', false),
    
    
    
    // spacings:
    padding         : 0,
    
    
    
    // typos:
    fontSize        : `${typoValues.fontSizeMd}`,
    textAlign       : 'center',
};



export const sectionDummy : React.CSSProperties = {
    // appearances:
    visibility      : 'hidden',
    
    
    
    // sizes:
    height          : '0.05px', // ensures the margin works on the hero section
};
export const sectionBase  : React.CSSProperties = {
    // layouts:
    display         : 'block', // content friendly layout
    
    
    
    // spacings:
    padding         : `${spacerValues.md}`,
};
export const section      : React.CSSProperties = {
    // layouts:
    ...sectionBase,
    
    
    
    // borders:
    ...borderAsHorzRule,
};
export const sectionLast  = sectionBase;



export const headingBase : React.CSSProperties = {
    // spacings:
    marginLeft      : 0,
    marginRight     : 0,
    marginTop       : 0,
    marginBottom    : `${headingValues.marginBlockEnd}`,
    
    
    
    // typos:
    fontWeight      : `${typoValues.fontWeightBold}`,
};
export const heading1    : React.CSSProperties = {
    // layouts:
    ...headingBase,
    
    
    
    // typos:
    fontSize        : `calc(2 * ${typoValues.fontSizeMd})`,
};
export const heading2    : React.CSSProperties = {
    // layouts:
    ...headingBase,
    
    
    
    // typos:
    fontSize        : `calc(1.75 * ${typoValues.fontSizeMd})`,
};



export const paragraphBase     : React.CSSProperties = {
    // spacings:
    marginLeft      : 0,
    marginRight     : 0,
    marginTop       : 0,
    marginBottom    : 0,
};
export const paragraph         : React.CSSProperties = {
    // layouts:
    ...paragraphBase,
    
    
    
    // spacings:
    marginTop       : `${paragraphValues.marginBlockStart}`,
    marginBottom    : `${paragraphValues.marginBlockEnd}`,
};
export const paragraphFirst    : React.CSSProperties = {
    // layouts:
    ...paragraphBase,
    
    
    
    // spacings:
    marginBottom    : `${paragraphValues.marginBlockEnd}`,
};
export const paragraphLast     : React.CSSProperties = {
    // layouts:
    ...paragraphBase,
    
    
    
    // spacings:
    marginTop       : `${paragraphValues.marginBlockStart}`,
};
export const paragraphCurrency : React.CSSProperties = {
    // layouts:
    ...paragraphBase,
    display         : 'flex', // makes marginInlineStart work
};
export const numberCurrency    : React.CSSProperties = {
    // spacings:
    // place the number to right_most:
    marginLeft        : 'auto', // fallback for GMail
    marginInlineEnd   : 0,      // kills the fallback above
    marginInlineStart : 'auto', // ltr/rtl aware
};



export const tableReset            : React.CSSProperties = {
    // layouts:
    tableLayout     : 'auto',
    
    
    
    // borders:
    borderCollapse  : 'separate',
    borderSpacing   : 0,
    
    
    
    // typos:
    textAlign       : 'start',
};
export const tableInfo             = tableReset;
export const tableInfoCenter       : React.CSSProperties = {
    // layouts:
    ...tableInfo,
    
    
    
    // positions:
    // needs to overwrite the paragraph's layout
    ...selfCenterHorz, // center self horizontally
};
export const tableInfoFill         : React.CSSProperties = {
    // layouts:
    ...tableInfo,
    
    
    
    // sizes:
    width : '100%',
};
export const tableTitleProduct     : React.CSSProperties = {
    // typos:
    fontSize        : `calc(1 * ${typoValues.fontSizeMd})`,
    fontWeight      : `${typoValues.fontWeightBold}`,
    textAlign       : 'start', // reset the default browser
};
export const tableTitleCenter      : React.CSSProperties = {
    // backgrounds & foregrounds:
    ...theme('primary'),
    
    
    
    // borders:
    ...borderAllSides,
    ...borderRadiusTopSide,
    
    
    
    // spacings:
    padding         : `calc(${spacerValues.md} * 0.75)`,
    
    
    
    // typos:
    fontSize        : `calc(1 * ${typoValues.fontSizeMd})`,
    fontWeight      : `${typoValues.fontWeightBold}`,
    textAlign       : 'center', // reset the default browser
};
export const tableTitleSide        : React.CSSProperties = {
    // positions:
    verticalAlign   : 'middle', // center vertically
    
    
    
    // sizes:
    boxSizing       : 'content-box',
    width           : '4em', // wrap for long title
    
    
    
    // borders:
    ...borderInlineStartSide,
    ...borderBottomSide,
    
    
    
    // spacings:
    padding         : `calc(${spacerValues.md} * 0.75)`,
    
    
    
    // typos:
    fontSize        : `calc(1 * ${typoValues.fontSizeMd})`,
    fontWeight      : `${typoValues.fontWeightBold}`,
    textAlign       : 'end', // align to right_most
};
export const tableTitleSideFirst   : React.CSSProperties = {
    // layouts:
    ...tableTitleSide,
    
    
    
    // borders:
    ...borderRadiusTopStartSide,
};
export const tableTitleSideLast    : React.CSSProperties = {
    // layouts:
    ...tableTitleSide,
    
    
    
    // borders:
    ...borderRadiusBottomStartSide,
};
export const tableLabelSide        : React.CSSProperties = {
    // positions:
    verticalAlign   : 'middle', // center vertically
    
    
    
    // typos:
    ...textSecondary,
    textAlign       : 'end', // align to right_most
};
export const tableContentSide      : React.CSSProperties = {
    // borders:
    ...borderInlineEndSide,
    ...borderBottomSide,
    
    
    
    // spacings:
    padding         : `calc(${spacerValues.md} * 0.75)`,
    
    
    
    // typos:
    whiteSpace      : 'normal',
    wordBreak       : 'break-all',
};
export const tableContentSideFirst : React.CSSProperties = {
    // layouts:
    ...tableContentSide,
    
    
    
    // borders:
    ...borderRadiusTopEndSide,
}
export const tableContentSideLast  : React.CSSProperties = {
    // layouts:
    ...tableContentSide,
    
    
    
    // borders:
    ...borderRadiusBottomEndSide,
}
export const tableColonSeparator   : React.CSSProperties = {
    // layouts:
    ...textSecondary,
    
    
    
    // spacings:
    paddingLeft     : `calc(${spacerValues.md} / 2)`,
    paddingRight    : `calc(${spacerValues.md} / 2)`,
};
export const tableGapSeparator     : React.CSSProperties = {
    // spacings:
    paddingRight    : `calc(${spacerValues.md} / 4)`,
};
export const tableColumnAutoSize   : React.CSSProperties = {
    // sizes:
    width : '100%', // fills the rest of table width
};
