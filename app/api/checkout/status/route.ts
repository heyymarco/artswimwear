export async function GET(req: Request, res: Response) {
    let responseStream = new TransformStream();
    const writer       = responseStream.writable.getWriter();
    const encoder      = new TextEncoder();
    
    
    
    const tickHandler = setInterval(async () => {
        const now = new Date();
        console.log('server tick!', now);
        try {
            await writer.write(encoder.encode('data: ' + JSON.stringify({
                serverTime: now.toString(),
            }) + '\n\n'));
        }
        catch {
            clearInterval(tickHandler);
        } // try
    }, 5 * 1000); // tick every 5 seconds
    
    // DOESN'T WORK:
    // // @ts-ignore
    // res.on('close', () => {
    //     console.log('connection to client is closed');
    // });
    
    // WORKS:
    writer.closed
    .then(() => {
        console.log('Connection to client is closed gracefully.');
        clearInterval(tickHandler);
    })
    .catch(() => {
        console.log('Connection to client is closed prematurely.');
        clearInterval(tickHandler);
    });
    
    
    
    // Return response connected to readable
    return new Response(responseStream.readable, {
        headers: {
            //For this example, lets allow access to all the origins, since we;re not sending any credentials:
            'Access-Control-Allow-Origin': '*',
            
            // This is important. We must keep the connection alive to let data stream do its thing:
            'Connection': 'keep-alive',
            
            // Another important line. The 'text/event-stream' content type is mandatory for SSE to work:
            'Content-Type': 'text/event-stream; charset=utf-8',
            
            // No use for caching since we're continuously getting new data:
            'Cache-Control': 'no-cache, no-transform',
            
            // By default, browsers compress the contents with `gzip` and we either have to gzip our content
            // ourselves or not do any encoding at all. I chose the latter, our payload is light anyway. 
            'Content-Encoding': 'none',
            
            'X-Accel-Buffering': 'no',
        },
    });
}

export const config = {
    runtime: 'edge',
};