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

// utilities:
import {
    uploadMedia,
    deleteMedia,
}                           from '@/libs/mediaStorage.server'
import {
    default as sharp,
}                           from 'sharp'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'



// types:
export type ImageId = string & {}



// // file processors:
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: '/tmp',
//         filename: (req, file, cb) => {
//             cb(null, file.originalname);
//             (req as any).originalname = file.originalname;
//         },
//     }),
// });
// const uploadMiddleware = upload.single('image');



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    // handler as GET,
    handler as POST,
    // handler as PUT,
    handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    (req as any).session = session;
    
    
    
    // authorized => next:
    return await next();
})
.post(async (req) => {
    const data = await req.formData();
    
    const file = data.get('image');
    // const file : Express.Multer.File = (req as any).file;
    if (!file || !(file instanceof Object)) {
        return NextResponse.json({
            error: 'No file uploaded.',
        }, { status: 400 }); // handled with error
    } // if
    if (file.size > (4 * 1024 * 1024)) { // limits to max 4MB
        return NextResponse.json({
            error: 'The file is too big. The limit is 4MB.',
        }, { status: 400 }); // handled with error
    } // if
    try {
        const {
            width  = 0,
            height = 0,
            format = 'raw',
        } = await sharp(await file.arrayBuffer()).metadata();
        
        if ((width < 48) || (width > 3840) || (height < 48) || (height > 3840)) {
            return NextResponse.json({
                error: 'The image dimension (width & height) must between 48 to 3840 pixels.',
            }, { status: 400 }); // handled with error
        } // if
        
        if (!(['jpg', 'jpeg', 'jp2', 'png', 'webp', 'svg'] as (keyof sharp.FormatEnum)[]).includes(format)) {
            return NextResponse.json({
                error: 'Invalid image file.\n\nThe supported images are jpg, png, webp, and svg.',
            }, { status: 400 }); // handled with error
        } // if
    }
    catch {
        return NextResponse.json({
            error: 'Invalid image file.\n\nThe supported images are jpg, png and webp.',
        }, { status: 400 }); // handled with error
    } // try
    
    
    
    try {
        const fileId = await uploadMedia(file, {
            folder : 'customerProfiles',
        });
        
        
        
        return NextResponse.json(fileId); // handled with success
    }
    catch (error: any) {
        return NextResponse.json({ error: error?.message ?? `${error}` }, { status: 500 }); // handled with error
    } // try
})
.patch(async (req) => {
    const {
        image: imageIds,
    } = await req.json();
    
    if (!Array.isArray(imageIds) || !imageIds.length || !imageIds.every((imageId) => (typeof(imageId) === 'string'))) {
        return NextResponse.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    try {
        await Promise.all(imageIds.map((imageId) => deleteMedia(imageId)));
        
        
        return NextResponse.json(imageIds); // deleted => success
    }
    catch (error: any) {
        if (error?.code === 404) { // not found => treat as success
            return NextResponse.json(imageIds); // deleted => success
        } // if
        return NextResponse.json({ error: error?.message ?? `${error}` }, { status: 500 }); // handled with error
    } // try
});