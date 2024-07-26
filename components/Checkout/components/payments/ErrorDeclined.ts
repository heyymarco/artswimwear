// utilities:
export interface ErrorDeclinedArg {
    message     ?: string
    shouldRetry ?: boolean
}
export class ErrorDeclined extends Error {
    readonly shouldRetry : boolean
    constructor(arg: ErrorDeclinedArg) {
        super(arg.message);
        this.shouldRetry = arg.shouldRetry ?? false; // default: please use another card
    }
}