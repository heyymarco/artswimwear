// react:
import {
    // react:
    default as React,
}                           from 'react'



export const document : React.CSSProperties = {
    // backgrounds:
    backgroundColor : '#ffffff',
    
    
    
    // foregrounds:
    color           : '#000000',
    
    
    
    // spacings:
    padding         : '1rem',
    
    
    
    // typos:
    fontSize        : '1rem',
    textAlign       : 'center',
};

export const headingBase : React.CSSProperties = {
    // spacings:
    margin          : 0,
    marginBottom    : '0.75em',
    
    
    
    // typos:
    fontWeight      : 'bold',
};
export const heading1 : React.CSSProperties = {
    // bases:
    ...headingBase,
    
    
    
    // typos:
    fontSize        : '2rem',
};
export const heading2 : React.CSSProperties = {
    // bases:
    ...headingBase,
    
    
    
    // typos:
    fontSize        : '1.75rem',
};

export const paragraphBase : React.CSSProperties = {
    // spacings:
    margin          : 0,
};
export const paragraph : React.CSSProperties = {
    // bases:
    ...paragraphBase,
    
    
    
    // spacings:
    marginBottom    : '1em',
};
export const paragraphCurrency : React.CSSProperties = {
    // bases:
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
    // bases:
    ...secondaryText,
    
    
    
    // positions:
    verticalAlign   : 'middle', // center to normal_size_text
    
    
    
    // typos:
    fontSize        : '0.75rem',
    fontWeight      : 'lighter',
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

export const colonSeparator : React.CSSProperties = {
    // bases:
    ...secondaryText,
    
    
    
    // spacings:
    paddingLeft     : '0.5em',
    paddingRight    : '0.5em',
};
