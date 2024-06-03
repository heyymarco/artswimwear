// webs:
import {
    default as nodemailer,
}                           from 'nodemailer'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 60; // this function can run for a maximum of 60 seconds for slow sending emails



export async function POST(req: Request, res: Response): Promise<Response> {
    const secretHeader = req.headers.get('X-Secret');
    if (!secretHeader || (secretHeader !== process.env.APP_SECRET)) {
        return Response.json({
            error: 'Unauthorized.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    
    
    const {
        from,
        to,
        
        subject,
        html,
        attachments,
    } = await req.json();
    if (
        (!from    || (typeof(from)    !== 'string'))
        ||
        (!to      || ((typeof(to)     !== 'string') && (!Array.isArray(to) || !to.every((t): t is string => !!t && (typeof(t) === 'string')))))
        ||
        (!subject || (typeof(subject) !== 'string'))
        ||
        (!html    || (typeof(html)    !== 'string'))
        ||
        ((attachments !== undefined) && (!Array.isArray(attachments) || !attachments.every((attachment): attachment is object => (typeof(attachment) === 'object'))))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    }
    
    
    
    const {
        emails : {
            checkout : checkoutEmail,
        },
    } = checkoutConfigServer;
    const transporter = nodemailer.createTransport({
        host     : checkoutEmail.host,
        port     : checkoutEmail.port,
        secure   : checkoutEmail.secure,
        auth     : {
            user : checkoutEmail.username,
            pass : checkoutEmail.password,
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