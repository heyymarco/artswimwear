'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useWishGroupImageStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    type ButtonProps,
    Button,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type ModelAddProps,
}                           from '@/components/explorers/PaginationGallery'
import {
    // types:
    type ComplexEditModelDialogResult,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import {
    type Model,
}                           from '@/models'



// react components:
export interface AddWishGroupImageProps<TModel extends Model>
    extends
        // bases:
        ModelAddProps<TModel, HTMLButtonElement>,
        ButtonProps
{
}
const AddWishGroupImage = <TModel extends Model>(props: AddWishGroupImageProps<TModel>): JSX.Element|null => {
    // props:
    const {
        // accessibilities:
        createItemText = 'Add New Collection',
        
        
        
        // components:
        modelCreateComponent,
        
        
        
        // handlers:
        onModelCreate,
        
        
        
        // other props:
        ...restAddWishGroupImageProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useWishGroupImageStyleSheet();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleShowDialog = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async (event): Promise<void> => {
        // conditions:
        if (!modelCreateComponent) return;
        
        
        
        // actions:
        const createdModel = (
            (typeof(modelCreateComponent) === 'function')
            ? await modelCreateComponent()
            : await showDialog<ComplexEditModelDialogResult<TModel>>(
                modelCreateComponent
            )
        );
        if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        
        
        
        if (createdModel) { // if closed of created Model (ignores of canceled or deleted Model)
            onModelCreate?.({
                model : createdModel,
                event : event,
            });
        } // if
    });
    
    
    
    // default props:
    const {
        // variants:
        theme      = 'primary',
        mild       = true,
        
        
        
        // classes:
        className  = '',
        
        
        
        // other props:
        ...restButtonProps
    } = restAddWishGroupImageProps;
    
    
    
    // jsx:
    return (
        <Button
            // other props:
            {...restButtonProps}
            
            
            
            // variants:
            theme={theme}
            mild={mild}
            
            
            
            // classes:
            className={`${styleSheet.main} ${styleSheet.add} add ${className}`}
            
            
            
            // handlers:
            onClick={handleShowDialog}
        >
            {/* #region just for preserving the consistent size to regular <ProductCard> */}
            {/* image (single image) -or- carousel (multi images) */}
            <div
                // classes:
                className='images noImage'
            />
            <div
                // classes:
                className='header'
            >
                <span
                    // classes:
                    className='name h6'
                />
                <span
                    // classes:
                    className='count'
                />
            </div>
            {/* #endregion just for preserving the consistent size to regular <ProductCard> */}
            
            <div className='addMessage'>
                <Icon icon='add' />
                <span>{createItemText}</span>
            </div>
        </Button>
    );
};
export {
    AddWishGroupImage,            // named export for readibility
    AddWishGroupImage as default, // default export to support React.lazy
}
