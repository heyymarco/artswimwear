'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// styles:
import {
    useWishlistGroupPreviewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationExplorer'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
import {
    EditWishlistGroupDialog,
}                           from '@/components/dialogs/EditWishlistGroupDialog'

// models:
import {
    type WishlistGroupDetail,
}                           from '@/models'



// react components:
export interface WishlistGroupPreviewProps extends ModelPreviewProps<WishlistGroupDetail> {}
const WishlistGroupPreview = (props: WishlistGroupPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useWishlistGroupPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // other props:
        ...restListItemProps
    } = props;
    const {
        name,
    } = model;
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    type EditMode = 'full'
    const handleEdit = useEvent((editMode: EditMode): void => {
        // just for cosmetic backdrop:
        const dummyPromise = (
            ['full', 'full-status', 'full-payment'].includes(editMode)
            ? showDialog(
                <DummyDialog
                    // global stackable:
                    viewport={listItemRef}
                />
            )
            : undefined
        );
        
        const dialogPromise = showDialog((() => {
            switch (editMode) {
                case 'full' : return (
                    <EditWishlistGroupDialog
                        // data:
                        model={model} // modify current model
                    />
                );
                default     : throw new Error('app error');
            } // switch
        })());
        
        if (dummyPromise) {
            dialogPromise.collapseStartEvent().then(() => dummyPromise.closeDialog(undefined));
        } // if
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <h3 className='name'>
                {name}
            </h3>
            
            <p className='fullEditor'>
                <EditButton icon='table_view' title='View the order details' className='fullEditor' buttonStyle='regular' onClick={() => handleEdit('full')}>
                    View Details
                </EditButton>
            </p>
        </ListItem>
    );
};
export {
    WishlistGroupPreview,
    WishlistGroupPreview as default,
}
