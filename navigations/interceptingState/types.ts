// types:
export interface DialogState {
    expanded       : boolean
    
    closingPromise : Promise<void>
    signalClosing  : () => void
    
    hasData        : boolean
    data           : boolean|undefined
}
