// webs:
import {
    default as nodemailer,
}                           from 'nodemailer'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 60; // this function can run for a maximum of 60 seconds for slow sending emails



export async function POST(req: Request): Promise<Response> {
    const secretHeader = req.headers.get('X-Secret');
    if (!secretHeader || (secretHeader !== process.env.APP_SECRET)) {
        return Response.json({
            error: 'Unauthorized.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    
    
    const {
        host,
        port,
        secure,
        user,
        pass,
        
        from,
        to,
        
        subject,
        html,
        attachments,
    } = await req.json();
    if (
        ((host    === undefined) || (typeof(host)    !== 'string' ) || !host)
        ||
        ((port    === undefined) || (typeof(port)    !== 'number' ))
        ||
        ((secure  === undefined) || (typeof(secure)  !== 'boolean'))
        ||
        ((user    === undefined) || (typeof(user)    !== 'string' ) || !user)
        ||
        ((pass    === undefined) || (typeof(pass)    !== 'string' ) || !pass)
        
        ||
        
        ((from    === undefined) || (typeof(from)    !== 'string' ) || !from)
        ||
        ((to      === undefined) || ((typeof(to)     !== 'string' ) && (!Array.isArray(to) || !to.every((t): t is string => (typeof(t) === 'string') && !!t))) || !to)
        ||
        ((subject === undefined) || (typeof(subject) !== 'string' ) || !subject)
        ||
        ((html    === undefined) || (typeof(html)    !== 'string' ) || !html)
        ||
        ((attachments !== undefined) && (!Array.isArray(attachments) || !attachments.every((attachment): attachment is object => (typeof(attachment) === 'object'))))
    ) {
        console.log('invalid data: ', {
            host,
            port,
            secure,
            user,
            pass,
            
            from,
            to,
            
            subject,
            html : typeof(html),
            attachments,
        });
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const transporter = nodemailer.createTransport({
        host     : host,
        port     : port,
        secure   : secure,
        auth     : {
            user : user,
            pass : pass,
        },
    });
    try {
        console.log('Sending email...');
        await transporter.sendMail({
            from        : from,
            to          : to,
            subject     : subject,
            html        : html,
            attachments : attachments,
        });
    }
    catch (error: any) {
        console.log('Email not sent.', error);
        return Response.json({
            error: 'Email not sent.',
        }, { status: 500 }); // handled with error
    }
    finally {
        transporter.close();
    } // try
    
    
    
    console.log('Email sent.');
    return Response.json({
        error: 'Email sent.',
    }); // handled with success
}