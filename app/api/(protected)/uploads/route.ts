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
    handler as HEAD,
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
        const nodeImageTransformer = sharp({
            failOn           : 'none',
            limitInputPixels : 3840*3840,
            density          : 72, // dpi
        })
        .resize({
            width              : 160,
            height             : 160,
            fit                : 'cover',
            background : {
                r              : 255,
                g              : 255,
                b              : 255,
                alpha          : 1,
            },
            withoutEnlargement : true,       // do NOT scale up
            withoutReduction   : false,      // do scale down
            kernel             : 'lanczos3', // interpolation kernels
        })
        .webp({
            quality            : 90,
            alphaQuality       : 90,
            lossless           : false,
            nearLossless       : false,
            effort             : 4,
        });
        
        
        
        // let handleData: ((chunk: any) => void)|undefined = undefined;
        let signalTransformDone : (() => void)|undefined = undefined;
        const webImageTransformer = new TransformStream({
            start(controller) {
                nodeImageTransformer.on('data', (chunk) => {
                    controller.enqueue(chunk); // forward a chunk of processed data to the next Stream
                    
                    if (signalTransformDone) {
                        signalTransformDone();
                    } // if
                });
                nodeImageTransformer.on('end', () => {
                    signalTransformDone?.(); // signal that the last data has been processed
                });
            },
            transform(chunk, controller) {
                nodeImageTransformer.write(chunk); // write a chunk of data to the Writable
            },
            async flush(controller) {
                const promiseTransformDone = new Promise<void>((resolved) => {
                    signalTransformDone = resolved;
                });
                nodeImageTransformer.end(); // signal that no more data will be written to the Writable
                await promiseTransformDone; // wait for the last data has been processed
            },
        });
        
        
        
        const fileName = file.name;
        const fileNameWithoutExt = fileName.match(/^.*(?=\.\w+$)/gi)?.[0] || fileName.split('.')?.[0] || 'image';
        const fileId = await uploadMedia(`${fileNameWithoutExt}.webp`, file.stream().pipeThrough(webImageTransformer), {
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
