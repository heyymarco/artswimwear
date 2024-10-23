import '@reusable-ui/typos/effects'
import { defineTheme, colorValues } from '@reusable-ui/core'
import { basicValues, buttonValues } from '@reusable-ui/components'

// other libs:
import Color                from 'color'                // color utilities



// Theme:
// light theme
colorValues.backg = colorValues.light;
colorValues.foreg = colorValues.dark;

const primaryCol = Color('hsl(185, 35%, 60%)').darken(0.2).saturate(0.2);
defineTheme('primary',    primaryCol);
colorValues.primaryText = primaryCol.lighten(1);
colorValues.primaryMild = primaryCol.lighten(1);
// colorValues.primaryMild = primaryCol.darken(0.5);

defineTheme('primaryAlt',             colorValues.primary.lighten(0.8));
(colorValues as any).primaryAltText = colorValues.primaryBold;
(colorValues as any).primaryAltMild = colorValues.primary.lighten(0.6);

const secondaryCol = primaryCol.rotate(5).desaturate(0.5).lighten(0.65);
defineTheme('secondary', secondaryCol);
colorValues.secondaryText = secondaryCol.darken(0.6);
colorValues.secondaryMild = secondaryCol.lighten(1);

// colorValues.dark = primaryCol.darken(0.5);
// colorValues.light = primaryCol.lighten(0.5);
// colorValues.dark = primaryCol.lighten(0.5);
// colorValues.light = primaryCol.darken(0.5);



// <Basic>:
basicValues.backgGrad = [
    ['linear-gradient(180deg, transparent, rgba(220, 220, 220, 1)) border-box'],
];
basicValues.backgroundBlendMode = 'saturation';



// <Button>:
buttonValues.backgroundBlendMode = 'saturation';
