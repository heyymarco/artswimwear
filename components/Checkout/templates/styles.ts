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
    
    
    
    // a typography management system:
    typoValues,
    horzRuleValues,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component




export const borderAsHorzRule : React.CSSProperties = {
    // borders:
    // borderBottom      : 'solid 1px currentColor', // fallback to currentColor if `color-mix` is not recognized
    // borderBottomColor : `color-mix(in srgb, currentcolor calc(${horzRules.opacity} * 100%), transparent)`, // causing whole inlineStyle removed in GMail
    borderBottom      : `${borderValues.style} ${borderValues.hair} rgba(0, 0, 0, ${horzRuleValues.opacity})`,
};

export const selfCenterHorz : React.CSSProperties = {
    // positions:
    // justifySelf     : 'center', // not supported in GMail
    marginLeft      : 'auto', // the another way to center horizontally
    marginRight     : 'auto', // the another way to center horizontally
};

export const article : React.CSSProperties = {
    // backgrounds:
    backgroundColor : colorValues.backg.hex().toLowerCase(),
    
    
    
    // foregrounds:
    color           : colorValues.foreg.hex().toLowerCase(),
    
    
    
    // spacings:
    padding         : 0,
    
    
    
    // typos:
    fontSize        : '1rem',
    textAlign       : 'center',
};
export const sectionBase : React.CSSProperties = {
    // layouts:
    display         : 'grid',
    // justifyItems    : 'center', // center items horizontally // not supported in GMail
    
    
    
    // spacings:
    padding         : '1rem',
};
export const section : React.CSSProperties = {
    // layouts:
    ...sectionBase,
    
    
    
    // borders:
    ...borderAsHorzRule,
};
export const sectionLast = sectionBase;

export const headingBase : React.CSSProperties = {
    // spacings:
    margin          : 0,
    marginBottom    : '0.75em',
    
    
    
    // typos:
    fontWeight      : 'bold',
};
export const heading1 : React.CSSProperties = {
    // layouts:
    ...headingBase,
    
    
    
    // typos:
    fontSize        : '2rem',
};
export const heading2 : React.CSSProperties = {
    // layouts:
    ...headingBase,
    
    
    
    // typos:
    fontSize        : '1.75rem',
};

export const paragraphBase : React.CSSProperties = {
    // spacings:
    margin          : 0,
};
export const paragraph : React.CSSProperties = {
    // layouts:
    ...paragraphBase,
    
    
    
    // spacings:
    marginBottom    : '1em',
};
export const paragraphCurrency : React.CSSProperties = {
    // layouts:
    ...paragraphBase,
    
    
    
    // layouts:
    display         : 'flex', // makes marginInlineStart work
};
export const numberCurrency : React.CSSProperties = {
    // spacings:
    // place the number to right_most:
    marginLeft        : 'auto', // fallback for GMail
    marginInlineStart : 'auto',
    marginInlineEnd   : 0,
};
export const paragraphLast = paragraphBase;

export const horzRule : React.CSSProperties = {
    // layouts:
    display         : 'block',
    
    
    
    // appearances:
    opacity         : 0.25,
    
    
    
    // borders:
    border          : 'solid 0px currentColor',
    borderTopWidth  : '1px',
    
    
    
    // spacings:
    margin          : 0,
    marginTop       : '1rem',
    marginBottom    : '1rem',
};

export const tableReset : React.CSSProperties = {
    // layouts:
    tableLayout     : 'auto',
    
    
    
    // borders:
    borderCollapse  : 'collapse',
    
    
    
    // typos:
    textAlign       : 'start',
};
export const tableTitle : React.CSSProperties = {
    // typos:
    fontSize        : '1rem',
    fontWeight      : 'bold',
    textAlign       : 'start', // reset the default browser
};
export const tableTitleCenter : React.CSSProperties = {
    // typos:
    fontSize        : '1rem',
    fontWeight      : 'bold',
    textAlign       : 'center', // reset the default browser
};
export const tableTitleSide : React.CSSProperties = {
    // positions:
    verticalAlign   : 'middle', // center vertically
    
    
    
    // sizes:
    boxSizing       : 'content-box',
    width           : '4em', // wrap for long title
    
    
    
    // spacings:
    paddingRight       : '1.5em', // fallback for GMail
    paddingInlineStart : 0,
    paddingInlineEnd   : '1.5em',
    
    
    
    // typos:
    fontSize        : '1rem',
    fontWeight      : 'bold',
    textAlign       : 'end', // align to right_most
};

export const secondaryText : React.CSSProperties = {
    // appearances:
    opacity         : 0.65,
};
export const smallText : React.CSSProperties = {
    // layouts:
    ...secondaryText,
    
    
    
    // positions:
    verticalAlign   : 'middle', // center to normal_size_text
    
    
    
    // typos:
    fontSize        : '0.75rem',
    // fontWeight      : 'lighter',
};
export const normalText : React.CSSProperties = {
    // positions:
    verticalAlign   : 'middle', // center to normal_size_text
    
    
    
    // typos:
    fontSize        : '1rem',
    fontWeight      : 'normal',
}

export const boldText : React.CSSProperties = {
    // typos:
    fontWeight      : 'bold',
};
export const bigText : React.CSSProperties = {
    // typos:
    fontSize        : '1.25rem',
};

export const tableLabelSide : React.CSSProperties = {
    // positions:
    verticalAlign   : 'middle', // center vertically
    
    
    
    // typos:
    ...secondaryText,
    textAlign       : 'end', // align to right_most
};
export const colonSeparator : React.CSSProperties = {
    // layouts:
    ...secondaryText,
    
    
    
    // spacings:
    paddingLeft     : '0.5em',
    paddingRight    : '0.5em',
};
