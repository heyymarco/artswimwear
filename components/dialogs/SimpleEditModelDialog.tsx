'use client'

// react-redux:
import type {
    MutationDefinition,
    BaseQueryFn,
}                           from '@reduxjs/toolkit/dist/query'
import type {
    MutationTrigger,
}                           from '@reduxjs/toolkit/dist/query/react/buildHooks'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    InitialValueHandler,
    UpdateHandler,
    ImplementedSimpleEditDialogProps,
    SimpleEditDialog,
}                           from '@/components/dialogs/SimpleEditDialog'

// internals:
import type {
    Model, MutationArgs,
}                           from '@/libs/types'




// types:
export type UpdateModelApi<TModel extends Model> = readonly [
    MutationTrigger<MutationDefinition<MutationArgs<TModel>, BaseQueryFn<any, unknown, unknown, {}, {}>, string, TModel>>,
    {
        isLoading   : boolean
    }
]



// react components:
export interface SimpleEditModelDialogProps<TModel extends Model>
    extends
        ImplementedSimpleEditDialogProps<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>
{
    // data:
    updateModelApi : UpdateModelApi<TModel> | (() => UpdateModelApi<TModel>)
}
export const SimpleEditModelDialog = <TModel extends Model>(props: SimpleEditModelDialogProps<TModel>) => {
    // rest props:
    const {
        // data:
        updateModelApi,
    ...restSimpleEditDialogProps} = props;
    
    
    
    // stores:
    const [updateModel, {isLoading}] = (typeof(updateModelApi) === 'function') ? updateModelApi() : updateModelApi;
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>>((edit, model) => {
        return model[edit] as TModel[keyof TModel];
    });
    const handleUpdate       = useEvent<UpdateHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>>(async (value, edit, model) => {
        if (value === '') value = null as typeof value; // auto convert empty string to null
        await updateModel({
            // @ts-ignore
            id     : model.id,
            
            [edit] : value,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>
            // other props:
            {...restSimpleEditDialogProps}
            
            
            
            // states:
            isLoading={isLoading}
            
            
            
            // data:
            initialValue={handleInitialValue}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
        />
    );
};