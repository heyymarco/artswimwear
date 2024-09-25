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
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// reusable-ui components:
import {
    // simple-components:
    Icon,
    ButtonIcon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    EditWishGroupDialog,
}                           from '@/components/dialogs/EditWishGroupDialog'

// models:
import {
    type WishGroupDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetWishPage,
}                           from '@/store/features/api/apiSlice'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface WishGroupImageProps {
    // data:
    model : WishGroupDetail
}
const WishGroupImage = (props: WishGroupImageProps): JSX.Element|null => {
    // styles:
    const styleSheet = useWishGroupImageStyleSheet();
    
    
    
    // props:
    const {
        // data:
        model,
    } = props;
    const {
        id,
        name,
    } = model;
    
    
    
    // stores:
    const { data: wishes } = useGetWishPage({ page: 1, perPage: 4, groupId: id || undefined /* fix empty_string id as `undefined` */ });
    const previews = !wishes ? undefined : Object.values(wishes.entities);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleEditClick   = useEvent((): void => {
        showDialog(
            <EditWishGroupDialog
                // data:
                model={model}
                
                
                
                // states:
                defaultExpandedTabIndex={0}
            />
        );
    });
    const handleDeleteClick = useEvent((): void => {
        showDialog(
            <EditWishGroupDialog
                // data:
                model={model}
                
                
                
                // states:
                defaultExpandedTabIndex={1}
            />
        );
    });
    
    
    
    // jsx:
    return (
        <article
            // identifiers:
            key={id}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <Link
                // data:
                href={`/customer/wishes/${!id ? 'all' : encodeURIComponent(id)}`}
            />
            {(!previews || !previews.length)   && <div className='images noImage'>
                <Icon icon='collections' size='xl' />
            </div>}
            {(!!previews && !!previews.length) && <div className='images'>
                {previews.map(({ image }, index) =>
                    <Image
                        // key:
                        key={index}
                        
                        
                        
                        // appearances:
                        alt={name}
                        src={resolveMediaUrl(image)}
                        sizes='207px' // (255*2) - ((4*16) * 1.5) = 414 => 414/2 = 207
                        
                        
                        
                        // classes:
                        className='prodImg'
                    />
                )}
            </div>}
            <header
                // classes:
                className='header'
            >
                <h2
                    // classes:
                    className='name h6'
                >
                    <span className='longText'>
                        {name}
                    </span>
                </h2>
                
                <span
                    // classes:
                    className='count'
                >
                    {!wishes && <span className='txt-sec'>
                        Loading...
                    </span>}
                    
                    {!!wishes && <>
                        {wishes.total} item{(wishes.total > 1) ? 's' : ''}
                    </>}
                </span>
                
                {!!model.id /* no edit|delete for 'All Items' */ && <DropdownListButton
                    // appearances:
                    // icon='more_vert'
                    
                    
                    
                    // variants:
                    theme='primary'
                    buttonStyle='link'
                    
                    
                    
                    // classes:
                    className='more'
                    
                    
                    
                    // components:
                    buttonComponent={
                        <ButtonIcon icon='more_vert' />
                    }
                >
                    <ListItem onClick={handleEditClick}>
                        <Icon icon='edit' /> Edit
                    </ListItem>
                    <ListItem theme='danger' onClick={handleDeleteClick}>
                        <Icon icon='delete' /> Delete
                    </ListItem>
                </DropdownListButton>}
            </header>
        </article>
    );
};
export {
    WishGroupImage,
    WishGroupImage as default,
}
