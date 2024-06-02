// configs:
export const fetchCache = 'force-no-store';
// export const runtime = 'edge';
// export const config = {
//     runtime: 'edge',
// };
export const maxDuration = 60; // This function can run for a maximum of 60 seconds



export async function POST(req: Request, res: Response) {
    const sendEmailPromise : Promise<void> = sendEmail();
    
    
    
    // return Response.json({
    //     status: 'okay',
    //     time : new Date(),
    // });
    
    const responseStream = new TransformStream();
    const writer         = responseStream.writable.getWriter();
    const encoder        = new TextEncoder();
    
    (async () => {
        await writer.write(encoder.encode('test'));
        await writer.close();
        await sendEmailPromise;
        console.log('task done!');
    })();
    
    writer.closed
    .then(() => {
        console.log('Connection to client is closed gracefully.');
    })
    .catch(() => {
        console.log('Connection to client is closed prematurely.');
    });
    
    return new Response(responseStream.readable);
}

const sendEmail = async () => {
    console.log('sending....');
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, 5000);
    })
    console.log('sent!');
}