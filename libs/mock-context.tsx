// react:
import {
    // react:
    default as React,
}                           from 'react'



// contexts:
const contextMap = new Map<Context<any>, /* contextStack: */any[]>();
export interface ProviderProps<T> {
    // contexts:
    value     : T
    
    
    
    // children:
    children ?: React.ReactNode
}
export interface Context<T extends any> {
    defaultValue : T
    Provider     : (props: ProviderProps<T>) => JSX.Element|null
}
export const createContext = <T extends any>(defaultValue: T): Context<T> => {
    const contextStack : T[] = [];
    const context : Context<T> = {
        defaultValue,
        Provider : (props) => {
            // jsx:
            const ContextEnter = (): JSX.Element|null => {
                contextStack.push(props.value);
                return null;
            };
            const ContextExit = (): JSX.Element|null => {
                contextStack.pop();
                return null;
            };
            return (
                <>
                    <ContextEnter />
                    {props.children}
                    <ContextExit />
                </>
            );
        },
    };
    contextMap.set(context, contextStack);
    return context;
};



// hooks:
export const useContext = <T extends any>(context: Context<T>): T => {
    const contextStack = contextMap.get(context);
    if ((contextStack !== undefined) && !!contextStack.length) return contextStack[contextStack.length - 1];
    return context.defaultValue;
};
