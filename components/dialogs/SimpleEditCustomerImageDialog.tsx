'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    // types:
    InitialValueHandler,
    TransformValueHandler,
    UpdateModelApi,
    
    
    
    // react components:
    ImplementedSimpleEditModelDialogProps,
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'

// stores:
import {
    // types:
    CustomerDetail,
    
    
    
    // hooks:
    useUpdateCustomer,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditCustomerImageDialogProps
    extends
        // bases:
        ImplementedSimpleEditModelDialogProps<CustomerDetail, 'image'>
{
}
export const SimpleEditCustomerImageDialog = (props: SimpleEditCustomerImageDialogProps) => {
    // handlers:
    interface CustomerImageModel {
        id    : CustomerDetail['id']
        image : string|null
    }
    const handleInitialValue   = useEvent<InitialValueHandler<CustomerImageModel>>((edit, model) => {
        return model[edit];
    });
    const handleTransformValue = useEvent<TransformValueHandler<CustomerImageModel>>((value, edit, model) => {
        return {
            id     : model.id,
            
            [edit] : value,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<CustomerImageModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<CustomerImageModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateCustomer as () => UpdateModelApi<CustomerImageModel>}
        />
    );
};
