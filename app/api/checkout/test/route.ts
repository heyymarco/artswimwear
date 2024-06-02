// configs:
export const fetchCache = 'force-no-store';
// export const runtime = 'edge';
// export const config = {
//     runtime: 'edge',
// };
export const maxDuration = 60; // This function can run for a maximum of 60 seconds



export async function POST(req: Request, res: Response) {
    const {
        id,
    } = await req.json();
    
    
    
    const sendEmailPromise : Promise<void> = sendEmail(id);
    
    
    
    const responseStream = new TransformStream();
    const writer         = responseStream.writable.getWriter();
    const encoder        = new TextEncoder();
    
    (async () => {
        await writer.write(encoder.encode(JSON.stringify({
            status: 'okay',
            time : new Date(),
            id : id,
        })));
        await writer.close();
        await sendEmailPromise;
        console.log('task done!', {id});
    })();
    
    writer.closed
    .then(() => {
        console.log('Connection to client is closed gracefully.');
    })
    .catch(() => {
        console.log('Connection to client is closed prematurely.');
    });
    
    return new Response(responseStream.readable, {
        headers : {
            'Content-Type': 'application/json',
        },
    });
}
export async function PATCH(req: Request, res: Response) {
    return Response.json({
        status: 'okay',
        time : new Date(),
    });
}

const sendEmail = async (id: string) => {
    console.log('sending....', {id});
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, 5000);
    })
    console.log('sent!', {id});
}