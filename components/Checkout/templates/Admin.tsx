// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useAdminDataContext,
}                           from './adminDataContext'



// react components:

const AdminName = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        admin,
    } = useAdminDataContext();
    
    
    
    // jsx:
    if (!admin) return null;
    return (
        admin.name ?? null
    );
};
const AdminEmail = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        admin,
    } = useAdminDataContext();
    
    
    
    // jsx:
    if (!admin) return null;
    return (
        admin.email ?? null
    );
};

export const Admin = {
    Name  : AdminName,
    Email : AdminEmail,
};
