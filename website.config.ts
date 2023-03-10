import { defineTheme } from '@reusable-ui/core';
import { iconConfig } from '@reusable-ui/components'



defineTheme('primary', 'hsl(28, 60%, 10%)');
defineTheme('secondary', 'hsl(28, 30%, 80%)');
console.log('color themes registered!');

iconConfig.image.files.push(
    { name: 'artswimwear.svg', ratio: '48/40' },
    { name: 'scrolldown.svg', ratio: '20/40' },
);
