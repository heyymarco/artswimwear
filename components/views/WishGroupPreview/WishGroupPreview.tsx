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
    useWishGroupPreviewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import {
    type EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
import {
    EditWishGroupDialog,
}                           from '@/components/dialogs/EditWishGroupDialog'

// heymarco components:
import {
    RadioDecorator,
}                           from '@heymarco/radio-decorator'

// models:
import {
    type WishGroupDetail,
}                           from '@/models'



// react components:
export interface WishGroupPreviewProps
    extends
        Omit<ModelPreviewProps<WishGroupDetail>,
            // values:
            |'onModelSelect'
        >
{
    // values:
    selectedModel ?: WishGroupDetail|null
    onModelSelect ?: EditorChangeEventHandler<WishGroupDetail>
}
const WishGroupPreview = (props: WishGroupPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useWishGroupPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // values:
        selectedModel,
        onModelSelect,
        
        
        
        // other props:
        ...restWishGroupPreviewProps
    } = props;
    const {
        id,
        name,
    } = model;
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // conditions:
        if (!event.currentTarget.contains(event.target as Node)) return; // ignore bubbling from <portal> of <EditRoleDialog>
        
        
        
        // actions:
        onModelSelect?.(model);
    });
    
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
                    <EditWishGroupDialog
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
    
    
    // default props:
    const {
        // behaviors:
        actionCtrl = true,
        
        
        
        // states:
        active     = (selectedModel?.id === id),
        
        
        
        // other props:
        ...restListItemProps
    } = restWishGroupPreviewProps;
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // behaviors:
            actionCtrl={actionCtrl}
            
            
            
            // states:
            active={active}
            
            
            
            // classes:
            className={styleSheet.main}
            
            
            
            // handlers:
            onClick={handleClick}
        >
            <RadioDecorator className='radio' />
            
            <h6 className='name'>
                {name}
            </h6>
            
            <EditButton
                // accessibilities:
                title='Edit Collection'
                
                
                
                // variants:
                mild={false}
                
                
                
                // classes:
                className='edit'
                
                
                
                // components:
                iconComponent={<Icon icon='edit' mild={active} />}
                
                
                
                // handlers:
                onClick={(event) => {
                    event.stopPropagation(); // prevent from causing `onModelSelect`
                    handleEdit('full');
                }}
            >
                {null}
            </EditButton>
        </ListItem>
    );
};
export {
    WishGroupPreview,
    WishGroupPreview as default,
}