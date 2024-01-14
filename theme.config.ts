// themes:
import './theme.basics.config'

import '@reusable-ui/typos/effects'
import { iconConfig, navbarValues } from '@reusable-ui/components'
import { imageValues } from '@heymarco/image'
import { dataTableValues } from '@heymarco/data-table'



// <Icon>:
iconConfig.image.files.push(
    { name: 'artswimwear.svg', ratio: '48/40' },
    { name: 'scrolldown.svg', ratio: '20/40' },
);



// <Navbar>:
navbarValues.boxSizing = 'border-box';
navbarValues.blockSize = '4rem';



// <Image>:
imageValues.objectFit = 'cover';



// <DataTable>:
dataTableValues.captionFilter = 'none';
