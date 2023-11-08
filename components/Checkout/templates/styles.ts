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
    
    
    
    // a spacer (gap) management system
    spacerValues,
    
    
    
    // a typography management system:
    typoValues,
    secondaryValues,
    headingValues,
    paragraphValues,
    horzRuleValues,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// other libs:
import Color                from 'color'                // color utilities

// configs:
import '@/theme.config'



export const textSecondary : React.CSSProperties = {
    // appearances:
    opacity         : `${secondaryValues.opacity}`,
};
export const textSmall     : React.CSSProperties = {
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
export const textNormal    : React.CSSProperties = {
    // positions:
    verticalAlign   : 'middle', // center to normal_size_text
    marginTop       : 'auto',
    marginBottom    : 'auto',
    
    
    
    // typos:
    fontSize        : `calc(1 * ${typoValues.fontSizeMd})`,
    fontWeight      : `${typoValues.fontWeightNormal}`,
};
export const textBold      : React.CSSProperties = {
    // typos:
    fontWeight      : `${typoValues.fontWeightBold}`,
};
export const textBig       : React.CSSProperties = {
    // typos:
    fontSize        : `calc(1.25 * ${typoValues.fontSizeMd})`,
};



const horzRuleBase            = (color?: React.CSSProperties['color']): string => (
    // `${borderValues.style} ${borderValues.hair} rgba(0, 0, 0, ${horzRuleValues.opacity})`
    `${borderValues.style} ${borderValues.hair} ${colorValues.primaryBold.mix(Color('#ffffff'), 1 - (Number.parseFloat(`${horzRuleValues.opacity ?? 0.25}`))).toString().toLowerCase()}`
);
export const horzRule         : React.CSSProperties = {
    // layouts:
    display         : 'block',
    
    
    
    // borders:
    borderLeft      : 0,
    borderRight     : 0,
    borderTop       : horzRuleBase(),
    borderBottom    : 0,
    
    
    
    // spacings:
    marginLeft      : 0,
    marginRight     : 0,
    marginTop       : `${spacerValues.md}`,
    marginBottom    : `${spacerValues.md}`,
};
export const borderAsHorzRule : React.CSSProperties = {
    // borders:
    borderLeft      : 0,
    borderRight     : 0,
    borderTop       : 0,
    borderBottom    : horzRuleBase(),
};
export const borderBottomSide : React.CSSProperties = {
    // borders:
    borderLeft      : 0,
    borderRight     : 0,
    borderTop       : 0,
    borderBottom    : horzRuleBase(colorValues.primaryBold.toString().toLowerCase()),
};
export const borderAllSides   : React.CSSProperties = {
    // borders:
    // border          : 'solid 1px currentColor', // fallback to currentColor if `color-mix` is not recognized
    // borderColor     : `color-mix(in srgb, currentcolor calc(${horzRules.opacity} * 100%), transparent)`, // causing whole inlineStyle removed in GMail
    border          : horzRuleBase(colorValues.primaryBold.toString().toLowerCase()),
};



export const selfCenterHorz : React.CSSProperties = {
    // positions:
    // justifySelf     : 'center', // not supported in GMail
    marginLeft      : 'auto', // the another way to center horizontally
    marginRight     : 'auto', // the another way to center horizontally
};



export const article : React.CSSProperties = {
    // backgrounds:
    backgroundColor : colorValues.secondaryThin.toString().toLowerCase(),
    
    
    
    // foregrounds:
    color           : colorValues.secondaryBold.toString().toLowerCase(),
    
    
    
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
    
    
    
    // layouts:
    display         : 'flex', // makes marginInlineStart work
};
export const numberCurrency    : React.CSSProperties = {
    // spacings:
    // place the number to right_most:
    marginLeft        : 'auto', // fallback for GMail
    marginInlineStart : 'auto',
    marginInlineEnd   : 0,
};



export const tableReset          : React.CSSProperties = {
    // layouts:
    tableLayout     : 'auto',
    
    
    
    // borders:
    borderCollapse  : 'collapse',
    
    
    
    // typos:
    textAlign       : 'start',
};
export const tableInfo           : React.CSSProperties = {
    // layouts:
    ...tableReset,
    
    
    
    // borders:
    ...borderAllSides,
};
export const tableTitleProduct   : React.CSSProperties = {
    // typos:
    fontSize        : `calc(1 * ${typoValues.fontSizeMd})`,
    fontWeight      : `${typoValues.fontWeightBold}`,
    textAlign       : 'start', // reset the default browser
};
export const tableTitleCenter    : React.CSSProperties = {
    // backgrounds:
    backgroundColor : colorValues.primary.mix(Color('#ffffff')).toString().toLowerCase(),
    
    
    
    // foregrounds:
    color           : colorValues.primaryBold.toString().toLowerCase(),
    
    
    
    // borders:
    ...borderBottomSide,
    
    
    
    // spacings:
    padding         : `calc(${spacerValues.md} * 0.75)`,
    
    
    
    // typos:
    fontSize        : `calc(1 * ${typoValues.fontSizeMd})`,
    fontWeight      : `${typoValues.fontWeightBold}`,
    textAlign       : 'center', // reset the default browser
};
export const tableTitleSide      : React.CSSProperties = {
    // positions:
    verticalAlign   : 'middle', // center vertically
    
    
    
    // sizes:
    boxSizing       : 'content-box',
    width           : '4em', // wrap for long title
    
    
    
    // spacings:
    padding         : `calc(${spacerValues.md} * 0.75)`,
    
    
    
    // typos:
    fontSize        : `calc(1 * ${typoValues.fontSizeMd})`,
    fontWeight      : `${typoValues.fontWeightBold}`,
    textAlign       : 'end', // align to right_most
};
export const tableLabelSide      : React.CSSProperties = {
    // positions:
    verticalAlign   : 'middle', // center vertically
    
    
    
    // typos:
    ...textSecondary,
    textAlign       : 'end', // align to right_most
};
export const tableContentSide    : React.CSSProperties = {
    // spacings:
    padding         : `calc(${spacerValues.md} * 0.75)`,
};
export const tableRowSeparator   = borderBottomSide;
export const tableColonSeparator : React.CSSProperties = {
    // layouts:
    ...textSecondary,
    
    
    
    // spacings:
    paddingLeft     : `calc(${spacerValues.md} / 2)`,
    paddingRight    : `calc(${spacerValues.md} / 2)`,
};
export const tableGapSeparator   : React.CSSProperties = {
    // spacings:
    paddingLeft     : `calc(${spacerValues.md} / 4)`,
};
export const tableColumnAutoSize : React.CSSProperties = {
    // sizes:
    width : '100%', // fills the rest of table width
};
