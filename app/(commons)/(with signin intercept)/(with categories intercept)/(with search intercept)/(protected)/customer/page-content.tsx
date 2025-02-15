'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// styles:
import {
    // style sheets:
    useProfilePageStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // status-components:
    Badge,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Main,
    Section,
}                           from '@heymarco/section'
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    ProfileImage,
}                           from '@/components/ProfileImage'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    UniqueUsernameEditor,
}                           from '@/components/editors/UniqueUsernameEditor'
import {
    SimpleEditModelDialogResult,
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
import {
    SimpleEditCustomerImageDialog,
}                           from '@/components/dialogs/SimpleEditCustomerImageDialog'

// models:
import {
    type CustomerDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateCustomer,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



export function ProfilePageContent() {
    // styles:
    const styleSheet = useProfilePageStyleSheet();
    
    
    
    // sessions:
    const { data: session, update: updateSession } = useSession();
    const customer = session?.user;
    const customerUsername = session?.credentials?.username ?? null;
    const customerModel = useMemo<CustomerDetail|null>(() => {
        if (!customer) return null;
        
        
        
        return {
            id       : customer.id,
            name     : customer.name,
            email    : customer.email,
            image    : customer.image,
            username : customerUsername,
        } satisfies CustomerDetail;
    }, [customer, customerUsername]);
    const { name: customerName, email: customerEmail, image: customerImage } = customerModel ?? {};
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleEdit = useEvent(async (edit: 'image'|'name'|'username') => {
        const updatedCustomerModel = await showDialog<SimpleEditModelDialogResult<CustomerDetail>>(
            (edit === 'image')
            ? <SimpleEditCustomerImageDialog
                // data:
                model={customerModel!}
                edit={edit}
                
                
                
                // stores:
                useUpdateModel={useUpdateCustomer}
            />
            : <SimpleEditModelDialog<CustomerDetail>
                // data:
                model={customerModel!}
                edit={edit}
                
                
                
                // stores:
                useUpdateModel={useUpdateCustomer}
                
                
                
                // components:
                editorComponent={(() => {
                    switch (edit) {
                        case 'name'     : return <NameEditor
                            // validations:
                            required={true}
                        />;
                        case 'username' : return <UniqueUsernameEditor currentValue={customerModel!['username'] ?? ''} />;
                        default         : throw Error('app error');
                    } // switch
                })()}
            />
        );
        if (updatedCustomerModel === undefined) return;
        updateSession();
    });
    
    
    
    // jsx:
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
                {/* profile image + edit button */}
                <CompoundWithBadge
                    // components:
                    wrapperComponent={<React.Fragment />}
                    badgeComponent={
                        <Badge
                            // variants:
                            nude={true}
                            
                            
                            
                            // classes:
                            className='floatingEdit'
                            
                            
                            
                            // floatable:
                            floatingPlacement='left-start'
                            floatingShift={0}
                            floatingOffset={0}
                        >
                            <EditButton className='edit overlay' onClick={() => handleEdit('image')}>{null} </EditButton>
                        </Badge>
                    }
                    elementComponent={
                        <ProfileImage
                            // appearances:
                            src={resolveMediaUrl(customerImage ?? undefined)}
                            
                            
                            
                            // variants:
                            theme='primary'
                            mild={true}
                            // profileImageStyle='circle'
                            
                            
                            
                            // classes:
                            className='preview'
                        />
                    }
                />
                
                <h3 className='name'>
                    <span className='label'>
                        Name:
                    </span>
                    {customerName}
                    <EditButton onClick={() => handleEdit('name')}>{null} </EditButton>
                </h3>
                
                <p className='username'>
                    <span className='label'>
                        Username:
                    </span>
                    {customerUsername || <span className='noValue'>No Username</span>}
                    <EditButton onClick={() => handleEdit('username')}>{null} </EditButton>
                </p>
                
                <p className='email'>
                    <span className='label'>
                        Email:
                    </span>
                    {customerEmail}
                </p>
            </Section>
        </Main>
    );
}
