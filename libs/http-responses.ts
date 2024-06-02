export interface StreamResponseOptions extends ResponseInit {
    backgroundTask ?: Promise<unknown>
}
export const streamResponse = (json: object, options?: StreamResponseOptions): Response => {
    // options:
    const {
        backgroundTask,
        ...responseInit
    } = options ?? {};
    
    
    
    const responseStream = new TransformStream();
    const writer         = responseStream.writable.getWriter();
    const encoder        = new TextEncoder();
    
    
    
    (async () => {
        await writer.write(encoder.encode(JSON.stringify(json)));
        await writer.close();
        
        
        
        // await for background task:
        await backgroundTask;
    })();
    
    
    
    responseInit.headers ??= {};
    const headers = responseInit.headers;
    if (headers instanceof Headers) {
        if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    }
    else if (Array.isArray(headers)) {
        if (!headers.find(([key]) => key.toLowerCase() === 'content-type')) headers.push(['Content-Type', 'application/json']);
    }
    else {
        headers['Content-Type'] = 'application/json';
    } // if
    
    return new Response(responseStream.readable, responseInit);
}
