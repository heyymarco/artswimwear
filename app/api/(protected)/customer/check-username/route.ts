// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'

// configs:
import {
    credentialsConfigServer,
}                           from '@/credentials.config.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as HEAD,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    
    
    
    // authorized => next:
    return await next();
})
.get(async (req) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    const {
        username : {
            minLength      : usernameMinLength,
            maxLength      : usernameMaxLength,
            format         : usernameFormat,
        },
    } = credentialsConfigServer;
    
    
    
    // validate the request parameter(s):
    const {
        username,
    } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
    if ((typeof(username) !== 'string') || !username) {
        return NextResponse.json({
            error: 'The required username is not provided.',
        }, { status: 400 }); // handled with error
    } // if
    if ((typeof(usernameMinLength) === 'number') && Number.isFinite(usernameMinLength) && (username.length < usernameMinLength)) {
        return NextResponse.json({
            error: `The username is too short. Minimum is ${usernameMinLength} characters.`,
        }, { status: 400 }); // handled with error
    } // if
    if ((typeof(usernameMaxLength) === 'number') && Number.isFinite(usernameMaxLength) && (username.length > usernameMaxLength)) {
        return NextResponse.json({
            error: `The username is too long. Maximum is ${usernameMaxLength} characters.`,
        }, { status: 400 }); // handled with error
    } // if
    if (!username.match(usernameFormat)) {
        return NextResponse.json({
            error: `The username is not well formatted.`,
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    //#region query result
    try {
        const result = await prisma.customerCredentials.findFirst({
            where  : {
                username : { equals: username, mode: 'insensitive' }, // case-insensitive comparison
            },
            select : {
                id : true,
            },
        });
        if (result) {
            return NextResponse.json({
                error: `The username "${username}" is already taken.`,
            }, { status: 409 }); // handled with error
        } // if
        
        
        
        return NextResponse.json({
            ok       : true,
            message  : `The username "${username}" can be used.`,
        }); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion query result
})
.put(async (req) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    const {
        username : {
            minLength      : usernameMinLength,
            maxLength      : usernameMaxLength,
            format         : usernameFormat,
            prohibited     : usernameProhibited,
        },
    } = credentialsConfigServer;
    
    
    
    // validate the request parameter(s):
    const {
        username,
    } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
    if ((typeof(username) !== 'string') || !username) {
        return NextResponse.json({
            error: 'The required username is not provided.',
        }, { status: 400 }); // handled with error
    } // if
    if ((typeof(usernameMinLength) === 'number') && Number.isFinite(usernameMinLength) && (username.length < usernameMinLength)) {
        return NextResponse.json({
            error: `The username is too short. Minimum is ${usernameMinLength} characters.`,
        }, { status: 400 }); // handled with error
    } // if
    if ((typeof(usernameMaxLength) === 'number') && Number.isFinite(usernameMaxLength) && (username.length > usernameMaxLength)) {
        return NextResponse.json({
            error: `The username is too long. Maximum is ${usernameMaxLength} characters.`,
        }, { status: 400 }); // handled with error
    } // if
    if (!username.match(usernameFormat)) {
        return NextResponse.json({
            error: `The username is not well formatted.`,
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    if (((): boolean => {
        for (const prohibited of usernameProhibited) {
            if (prohibited instanceof RegExp) {
                if (prohibited.test(username)) return true; // prohibited word found
            }
            else {
                if (prohibited === username  ) return true; // prohibited word found
            } // if
        } // for
        
        return false; // all checks passed, no prohibited word was found
    })()) {
        return NextResponse.json({
            error: `The username "${username}" is prohibited.`,
        }, { status: 409 }); // handled with error
    } // if
    
    
    
    return NextResponse.json({
        ok       : true,
        message  : `The username "${username}" can be used.`,
    }); // handled with success
});
