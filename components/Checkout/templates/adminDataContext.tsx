// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '@/libs/mock-context'



// contexts:
export interface Admin {
    // data:
    name  : string
    email : string
}
export interface AdminDataApi {
    // data:
    admin : Admin
}
const AdminDataContext = createContext<AdminDataApi>({
    admin : undefined as any,
});



// hooks:
export const useAdminDataContext = () => {
    return useContext(AdminDataContext);
};



// react components:
export interface AdminDataContextProviderProps {
    // data:
    admin : Admin
}
export const AdminDataContextProvider = (props: React.PropsWithChildren<AdminDataContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <AdminDataContext.Provider value={props}>
            {props.children}
        </AdminDataContext.Provider>
    );
};
