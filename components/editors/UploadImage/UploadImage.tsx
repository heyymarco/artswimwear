// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMergeClasses,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a capability of UI to be disabled:
    useDisableable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // hooks:
    useScheduleTriggerEvent,
    
    
    
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
    Content,
    
    
    
    // simple-components:
    Icon,
    ButtonProps,
    ButtonIcon,
    
    
    
    // status-components:
    Busy,
    
    
    
    // composite-components:
    ProgressProps,
    Progress,
    ProgressBarProps,
    ProgressBar,
    
    
    
    // utility-components:
    getFetchErrorMessage,
}                           from '@reusable-ui/components'

// other libs:
import {
    default as MimeMatcher,
}                           from 'mime-matcher'

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // configs:
    uploadImages,
}                           from './styles/config'



// styles:
export const useUploadImageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { specificityWeight: 2, id: 'glt9axuphe' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './styles/styles'



// utilities:
const resolveSrc = <TValue extends ImageData = ImageData>(imageData: TValue, onResolveImageUrl: ((imageData: TValue) => URL|string)|undefined): string => {
    if (!onResolveImageUrl) return (typeof(imageData) === 'string') ? imageData : imageData.url;
    const resolved = onResolveImageUrl(imageData);
    return (typeof(resolved) === 'string') ? resolved : resolved.href;
};
const resolveAlt = <TValue extends ImageData = ImageData>(imageData: TValue): string => {
    return ((typeof(imageData) === 'string') ? '' : imageData.title) || '';
};



// types:
export type DetailedImageData = {
    url    : string
    title ?: string
}
export type ImageData =
    |string
    |DetailedImageData

type UploadingImageData = {
    imageFile   : File
    percentage  : number|null
    uploadError : React.ReactNode
    onRetry     : () => void
    onCancel    : () => void
}



// react components:
export interface UploadImageProps<TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue|null>,
            // accessibilities:
            |'readOnly'
            
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        Omit<BasicProps<TElement>,
            // values:
            |'defaultValue' // not supported
            |'value'        // not supported
            |'onChange'     // not supported
            
            // children:
            |'children'     // already taken over
        >
{
    // actions:
    deletingImageTitle                ?: React.ReactNode
    deleteButtonText                  ?: React.ReactNode
    onDeleteImage                     ?: (args: { imageData: TValue }) => boolean|Error|Promise<boolean|Error>
    
    
    
    // upload images:
    selectButtonText                  ?: React.ReactNode
    uploadImageType                   ?: string
    
    
    
    // uploading images:
    uploadingImageTitle               ?: React.ReactNode
    uploadingImageErrorTitle          ?: React.ReactNode
    uploadingImageRetryText           ?: React.ReactNode
    uploadingImageCancelText          ?: React.ReactNode
    
    
    
    // upload activities:
    onUploadImage                     ?: (args: { imageFile: File, reportProgress: (percentage: number) => void, abortSignal: AbortSignal }) => TValue|Error|null|Promise<TValue|Error|null>
    onUploadImageProgress             ?: (args: { imageFile: File, percentage: number|null }) => string
    
    
    
    // components:
    bodyComponent                     ?: React.ReactComponentElement<any, BasicProps<TElement>>
    
    mediaGroupComponent               ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    noImageComponent                  ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    previewImageComponent             ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    imageComponent                    ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    
    deletingImageTitleComponent       ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>|null
    busyComponent                     ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    
    mediaGroupComponentInner          ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    uploadingImageTitleComponent      ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>|null
    progressComponent                 ?: React.ReactComponentElement<any, ProgressProps<Element>>
    progressBarComponent              ?: React.ReactComponentElement<any, ProgressBarProps<Element>>
    uploadErrorComponent              ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    uploadingImageErrorTitleComponent ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>|null
    
    actionGroupComponent              ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    selectButtonComponent             ?: React.ReactComponentElement<any, ButtonProps>
    deleteButtonComponent             ?: React.ReactComponentElement<any, ButtonProps>
    retryButtonComponent              ?: React.ReactComponentElement<any, ButtonProps>
    cancelButtonComponent             ?: React.ReactComponentElement<any, ButtonProps>
    
    
    
    // handlers:
    onResolveImageUrl                 ?: (imageData: TValue) => URL|string
}
const UploadImage = <TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>(props: UploadImageProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styleSheet = useUploadImageStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        readOnly = false,
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = null,
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // actions:
        deletingImageTitle                = 'Deleting...',
        deleteButtonText                  = 'Delete Image',
        onDeleteImage,
        
        
        
        // upload images:
        selectButtonText                  = 'Select Image',
        uploadImageType                   = 'image/jpg, image/jpeg, image/png, image/svg',
        
        
        
        // uploading images:
        uploadingImageTitle               = 'Uploading...',
        uploadingImageErrorTitle          = 'Upload Error',
        uploadingImageRetryText           = 'Retry',
        uploadingImageCancelText          = 'Cancel',
        
        
        
        // upload activities:
        onUploadImage,
        onUploadImageProgress             = () => '',
        
        
        
        // components:
        bodyComponent                     = (<Content<TElement>                                                   /> as React.ReactComponentElement<any, BasicProps<TElement>>),
        
        deletingImageTitleComponent       = (<h1                                                                  /> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        uploadingImageTitleComponent      = (<h1                                                                  /> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        uploadingImageErrorTitleComponent = (<h1                                                                  /> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        mediaGroupComponent               = (<Basic tag='div' mild={true}                                         /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        mediaGroupComponentInner          = (<div                                                                 /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        noImageComponent                  = (<Icon       icon='image'       size='xl'                             /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        imageComponent                    = (<img                                                                 /> as React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>),
        busyComponent                     = (<Busy                          size='lg'                             /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        previewImageComponent             = imageComponent,
        progressComponent                 = (<Progress                      size='sm'                             /> as React.ReactComponentElement<any, ProgressProps<Element>>),
        progressBarComponent              = (<ProgressBar                                                         /> as React.ReactComponentElement<any, ProgressBarProps<Element>>),
        uploadErrorComponent              = (<Basic                         size='sm' mild={true} theme='danger'  /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        
        actionGroupComponent              = (<div                                                                 /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        selectButtonComponent             = (<ButtonIcon icon='upload_file'                                       /> as React.ReactComponentElement<any, ButtonProps>),
        deleteButtonComponent             = (<ButtonIcon icon='clear'                 mild={true} theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
        retryButtonComponent              = (<ButtonIcon icon='refresh'                           theme='success' /> as React.ReactComponentElement<any, ButtonProps>),
        cancelButtonComponent             = (<ButtonIcon icon='cancel'                            theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
        
        
        
        // handlers:
        onResolveImageUrl,
    ...restBasicProps} = props;
    
    
    
    // refs:
    const inputFileRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue|null>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const [uploadingImage , setUploadingImage] = useState<UploadingImageData|null>(null);
    const uploadingImageRef                    = useRef<UploadingImageData|null>(uploadingImage);
    uploadingImageRef.current                  = uploadingImage;
    const isUnknownProgress                    = !!uploadingImage && (uploadingImage.percentage === null);
    const isError                              = !!uploadingImage && !!uploadingImage.uploadError && (uploadingImage.uploadError !== true);
    
    const [previewImage   , setPreviewImage  ] = useState<string|null>(null);
    
    let   [isBusy, setIsBusy]                  = useState<boolean>(false);
    const disableableState                     = useDisableable<HTMLImageElement>({
        enabled : !isBusy,
    });
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const selectButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        inputFileRef.current?.click();
    });
    const selectButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `selectButtonComponent`:
        selectButtonComponent.props.onClick,
        
        
        
        // actions:
        selectButtonHandleClickInternal,
    );
    
    const deleteButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault();             // handled
        
        
        
        // actions:
        handleDeleteImage({
            /* empty: reserved for future */
        });
    });
    const deleteButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `deleteButtonComponent`:
        deleteButtonComponent.props.onClick,
        
        
        
        // actions:
        deleteButtonHandleClickInternal,
    );
    const handleDeleteImage               = useEvent(async (args: { /* empty: reserved for future */ }): Promise<void> => {
        // params:
        const {
            /* empty: reserved for future */
        ...restParams} = args;
        
        
        
        // conditions:
        if (isBusy)     return; // this component is busy => ignore
        const imageData = value;
        if (!imageData) return; // no image => nothing to delete
        if (onDeleteImage) {
            setIsBusy(isBusy /* instant update without waiting for (slow|delayed) re-render */ = true);
            try {
                const result = await onDeleteImage({
                    ...restParams,
                    
                    imageData : imageData,
                });
                if (result instanceof Error) return; // error => abort
                if (result === false)        return; // the delete action was prevented by <parent> => ignore
            }
            catch {
                return; // error => abort
            }
            finally {
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                setIsBusy(isBusy /* instant update without waiting for (slow|delayed) re-render */ = false);
            } // try
        } // if
        
        
        
        // successfully deleted:
        
        
        
        // notify the image changed:
        triggerValueChange(null, { triggerAt: 'macrotask' }); // then at the *next re-render*, the *controllable* `image` will change
    });
    
    const inputFileHandleChange           = useEvent<React.ChangeEventHandler<HTMLInputElement>>(async () => {
        // conditions:
        const inputFileElm = inputFileRef.current;
        if (!inputFileElm)       return; // input file is not loaded => ignore
        
        const files = inputFileElm.files;
        if (!files)              return; // no file selected => ignore
        
        
        
        // actions:
        try {
            handleFilesAdded(files);
        }
        finally {
            // unselect files after the selected files has taken:
            inputFileElm.value = '';
        } // try
    });
    const handleFilesAdded                = useEvent((files: FileList): void => {
        // conditions:
        if (!onUploadImage) return; // the upload image handler is not configured => ignore
        
        
        
        // actions:
        const mimeMatcher = new MimeMatcher(...uploadImageType.split(',').map((mime) => mime.trim()));
        
        // for (const imageFile of files) {
        //     // conditions:
        //     if (!mimeMatcher.match(imageFile.type)) {
        //         continue; // ignore foreign files
        //     } // if
        //     
        //     
        //     
        //     // actions:
        //     handleUploadImage({
        //         imageFile : imageFile,
        //     });
        // } // for
        
        const imageFile = files?.[0];
        if (!imageFile) return; // no file selected => ignore
        if (!mimeMatcher.match(imageFile.type)) {
            return; // ignore foreign files
        } // if
        handleUploadImage({
            imageFile : imageFile,
        });
    });
    const handleUploadImage               = useEvent((args: { imageFile: File }): void => {
        // conditions:
        if (!onUploadImage) return; // the upload image handler is not configured => ignore
        
        
        
        // params:
        const {
            imageFile,
        ...restParams} = args;
        
        
        
        // add a new uploading status:
        const abortController    = new AbortController();
        const abortSignal        = abortController.signal;
        const isUploadCanceled   = (): boolean => {
            return (
                !isMounted.current
                ||
                abortSignal.aborted
            );
        };
        const handleUploadRetry  = (): void => {
            // conditions:
            if (isUploadCanceled()) return; // the uploader was canceled => do nothing
            
            
            
            // resets:
            const uploadingImageData = uploadingImageRef.current;
            if (uploadingImageData) {
                uploadingImageData.percentage  = null; // reset progress
                uploadingImageData.uploadError = null; // reset error
                setUploadingImage({...uploadingImageData}); // force to re-render
            } // if
            
            
            
            // actions:
            performUpload();
        };
        const handleUploadCancel = (): void => {
            // conditions:
            if (isUploadCanceled()) return; // the uploader was canceled => do nothing
            
            
            
            // abort the upload progress:
            abortController.abort();
            
            
            
            // remove the uploading status:
            performRemove();
        };
        const uploadingImageData : UploadingImageData = {
            imageFile   : imageFile,
            percentage  : null,
            uploadError : null,
            onRetry     : handleUploadRetry,
            onCancel    : handleUploadCancel,
        };
        setUploadingImage(uploadingImageData); // set a new uploading status
        
        
        
        // uploading progress:
        const handleReportProgress = (percentage: number): void => {
            // conditions:
            if (!isMounted.current ) return; // the component was unloaded => do nothing
            const uploadingImageData = uploadingImageRef.current;
            if (!uploadingImageData) return; // upload was not started or aborted => do nothing
            if (uploadingImageData.percentage === percentage)  return; // already the same => do nothing
            
            
            
            // updates:
            uploadingImageData.percentage = percentage; // update the percentage
            setUploadingImage({...uploadingImageData}); // force to re-render
        };
        const performRemove        = (): void => {
            // remove the uploading status:
            setUploadingImage(null);
        };
        const performUpload        = async (): Promise<void> => {
            let imageData : TValue|Error|null|undefined = undefined;
            try {
                imageData = await onUploadImage({
                    ...restParams,
                    
                    imageFile      : imageFile,
                    reportProgress : handleReportProgress,
                    abortSignal    : abortSignal,
                });
                if (imageData instanceof Error) throw imageData;
                
                
                
                // conditions:
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            }
            catch (fetchError: any) {
                // conditions:
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                const uploadingImageData = uploadingImageRef.current;
                if (!uploadingImageData) return; // upload was not started => do nothing
                
                
                
                uploadingImageData.uploadError = getFetchErrorMessage(fetchError);
                setUploadingImage({...uploadingImageData}); // force to re-render
                return; // failed => no further actions
            } // try
            
            
            
            // successfully uploaded:
            if (imageData) {
                // notify the image changed:
                triggerValueChange(imageData, { triggerAt: 'macrotask' }); // then at the *next re-render*, the *controllable* `image` will change
            } // if
            
            
            
            // remove the uploading status:
            scheduleTriggerEvent(performRemove, { triggerAt: 'macrotask' }); // runs the `performRemove` function *next after* `onChange` event fired (to avoid blinking of previous image issue, the controllable image should be *already applied* before we're removing the `uploadingImage` draft)
        };
        performUpload();
    });
    
    const retryButtonHandleClickInternal  = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        uploadingImage?.onRetry?.();
    });
    const retryButtonHandleClick          = useMergeEvents(
        // preserves the original `onClick` from `retryButtonComponent`:
        retryButtonComponent.props.onClick,
        
        
        
        // actions:
        retryButtonHandleClickInternal,
    );
    
    const cancelButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        uploadingImage?.onCancel?.();
    });
    const cancelButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `cancelButtonComponent`:
        cancelButtonComponent.props.onClick,
        
        
        
        // actions:
        cancelButtonHandleClickInternal,
    );
    
    const handleAnimationStart            = useMergeEvents(
        // preserves the original `onAnimationStart` from `imageComponent`:
        imageComponent.props.onAnimationStart,
        
        
        
        // states:
        disableableState.handleAnimationStart,
    );
    const handleAnimationEnd              = useMergeEvents(
        // preserves the original `onAnimationEnd` from `imageComponent`:
        imageComponent.props.onAnimationEnd,
        
        
        
        // states:
        disableableState.handleAnimationEnd,
    );
    
    
    
    // classes:
    const classes      = useMergeClasses(
        // preserves the original `classes` from `bodyComponent`:
        bodyComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        styleSheet.main,
        (readOnly ? 'readonly' : null),
    );
    
    
    
    // dom effects:
    const uploadingImageFile = uploadingImage?.imageFile;
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!uploadingImageFile) return; // no uploading file => ignore
        
        
        
        // setups:
        const previewImageUrl = URL.createObjectURL(uploadingImageFile);
        setPreviewImage(previewImageUrl);
        
        
        
        // cleanups:
        return () => {
            URL.revokeObjectURL(previewImageUrl);
            setPreviewImage(null);
        };
    }, [uploadingImageFile]);
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isBusy}>
            {React.cloneElement<BasicProps<TElement>>(bodyComponent,
                // props:
                {
                    // other props:
                    ...restBasicProps,
                    ...bodyComponent.props, // overwrites restBasicProps (if any conflics)
                    
                    
                    
                    // variants:
                    mild    : bodyComponent.props.mild ?? props.mild ?? true,
                    
                    
                    
                    // classes:
                    classes : classes,
                },
                
                
                
                // children:
                bodyComponent.props.children ?? <>
                    {/* <MediaGroup> */}
                    {React.cloneElement<React.HTMLAttributes<HTMLElement>>(mediaGroupComponent,
                        // props:
                        {
                            // classes:
                            className : mediaGroupComponent.props.className ?? 'mediaGroup',
                        },
                        
                        
                        
                        // children:
                        mediaGroupComponent.props.children ?? <>
                            {/* <NoImage> */}
                            {(!uploadingImage && !value) && React.cloneElement<React.HTMLAttributes<HTMLElement>>(noImageComponent,
                                // props:
                                {
                                    // classes:
                                    className : noImageComponent.props.className ?? 'noImage',
                                },
                            )}
                            
                            {/* <PreviewImage> */}
                            {!!uploadingImage && !!previewImage && !readOnly && React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(previewImageComponent,
                                // props:
                                {
                                    // classes:
                                    className : previewImageComponent.props.className ?? 'previewImage',
                                    
                                    
                                    
                                    // images:
                                    alt       : previewImageComponent.props.alt   ?? '',
                                    src       : previewImageComponent.props.src   ?? previewImage,
                                    sizes     : previewImageComponent.props.sizes ?? uploadImages.previewImageInlineSize,
                                },
                            )}
                            
                            {/* <Image> */}
                            { !uploadingImage && !!value && React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(imageComponent,
                                // props:
                                {
                                    // classes:
                                    className        : imageComponent.props.className ?? `image ${disableableState.class ?? ''}`,
                                    
                                    
                                    
                                    // :disabled | [aria-disabled]
                                    ...disableableState.props,
                                    
                                    
                                    
                                    // images:
                                    alt              : imageComponent.props.alt   ??  resolveAlt(value),
                                    src              : imageComponent.props.src   ?? (resolveSrc(value, onResolveImageUrl) || undefined), // convert empty string to undefined
                                    sizes            : imageComponent.props.sizes ?? uploadImages.imageInlineSize,
                                    
                                    
                                    
                                    // handlers:
                                    onAnimationStart : handleAnimationStart,
                                    onAnimationEnd   : handleAnimationEnd,
                                },
                            )}
                            
                            {/* <MediaGroupInner> */}
                            {((!uploadingImage && !!value && isBusy) || !!uploadingImage) && !readOnly && React.cloneElement<React.HTMLAttributes<HTMLElement>>(mediaGroupComponentInner,
                                // props:
                                {
                                    // classes:
                                    className : mediaGroupComponentInner.props.className ?? 'mediaGroupInner',
                                },
                                
                                
                                
                                // children:
                                mediaGroupComponentInner.props.children ?? <>
                                    {/* <DeletingImageTitle> + <Busy> */}
                                    {(!uploadingImage && !!value && isBusy) && <>
                                        {/* <DeletingImageTitle> */}
                                        {!!deletingImageTitleComponent && React.cloneElement<React.HTMLAttributes<HTMLElement>>(deletingImageTitleComponent,
                                            // props:
                                            {
                                                // classes:
                                                className : deletingImageTitleComponent.props.className ?? 'deletingImageTitle',
                                            },
                                            
                                            
                                            
                                            // children:
                                            deletingImageTitle,
                                        )}
                                        
                                        {/* <Busy> */}
                                        {React.cloneElement<React.HTMLAttributes<HTMLElement>>(busyComponent,
                                            // props:
                                            {
                                                // classes:
                                                className : busyComponent.props.className ?? 'busy',
                                            },
                                        )}
                                    </>}
                                    
                                    {/* <UploadingImageTitle> + <Progress> + <UploadError> */}
                                    {!!uploadingImage && <>
                                        {/* <UploadingImageTitle> */}
                                        {!isError && !!uploadingImageTitleComponent && React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(uploadingImageTitleComponent,
                                            // props:
                                            {
                                                // classes:
                                                className : uploadingImageTitleComponent.props.className ?? 'uploadingImageTitle',
                                            },
                                            
                                            
                                            
                                            // children:
                                            uploadingImageTitle,
                                        )}
                                        
                                        {/* <Progress> */}
                                        {!isError && React.cloneElement<ProgressProps<Element>>(progressComponent,
                                            // props:
                                            {
                                                // classes:
                                                className : progressComponent.props.className ?? 'uploadProgress',
                                            },
                                            
                                            
                                            
                                            // children:
                                            /* <ProgressBar> */
                                            progressComponent.props.children ?? React.cloneElement<ProgressBarProps<Element>>(progressBarComponent,
                                                // props:
                                                {
                                                    // variants:
                                                    progressBarStyle : progressBarComponent.props.progressBarStyle ?? (isUnknownProgress ? 'striped' : undefined),
                                                    
                                                    
                                                    
                                                    // states:
                                                    running          : progressBarComponent.props.running          ?? (isUnknownProgress ? true : undefined),
                                                    
                                                    
                                                    
                                                    // values:
                                                    value            : progressBarComponent.props.value            ?? (isUnknownProgress ? 100 : (uploadingImage.percentage ?? 100)),
                                                },
                                                
                                                
                                                
                                                // children:
                                                progressBarComponent.props.children ?? onUploadImageProgress({
                                                    imageFile  : uploadingImage.imageFile,
                                                    percentage : uploadingImage.percentage,
                                                }),
                                            ),
                                        )}
                                        
                                        {/* <UploadError> */}
                                        {isError && React.cloneElement<React.HTMLAttributes<HTMLElement>>(uploadErrorComponent,
                                            // props:
                                            {
                                                // classes:
                                                className : uploadErrorComponent.props.className ?? 'uploadError',
                                            },
                                            
                                            
                                            
                                            // children:
                                            uploadErrorComponent.props.children ?? <>
                                                {/* <UploadingImageErrorTitle> */}
                                                {!!uploadingImageErrorTitleComponent && React.cloneElement<Pick<React.HTMLAttributes<Element>, 'className'>>(uploadingImageErrorTitleComponent,
                                                    // props:
                                                    {
                                                        // classes:
                                                        className : uploadingImageErrorTitleComponent.props.className ?? 'uploadingImageErrorTitle',
                                                    },
                                                    
                                                    
                                                    
                                                    // children:
                                                    uploadingImageErrorTitle,
                                                )}
                                                
                                                {/* <UploadingImageErrorMessage> */}
                                                {uploadErrorComponent.props.children ?? uploadingImage.uploadError}
                                            </>,
                                        )}
                                    </>}
                                </>,
                            )}
                        </>,
                    )}
                    
                    {/* <ActionGroup> */}
                    {!readOnly && React.cloneElement<React.HTMLAttributes<HTMLElement>>(actionGroupComponent,
                        // props:
                        {
                            // classes:
                            className : actionGroupComponent.props.className ?? 'actionGroup',
                        },
                        
                        
                        
                        // children:
                        actionGroupComponent.props.children ?? <>
                            {/* <SelectButton> + <DeleteButton> */}
                            {!uploadingImage && <>
                                {/* <SelectButton> */}
                                {React.cloneElement<ButtonProps>(selectButtonComponent,
                                    // props:
                                    {
                                        // classes:
                                        className : selectButtonComponent.props.className ?? 'selectButton',
                                        
                                        
                                        
                                        // handlers:
                                        onClick   : selectButtonHandleClick,
                                    },
                                    
                                    
                                    
                                    // children:
                                    selectButtonComponent.props.children ?? selectButtonText,
                                )}
                                
                                {/* <DeleteButton> */}
                                {!!value && React.cloneElement<ButtonProps>(deleteButtonComponent,
                                    // props:
                                    {
                                        // classes:
                                        className : deleteButtonComponent.props.className ?? 'deleteButton',
                                        
                                        
                                        
                                        // handlers:
                                        onClick : deleteButtonHandleClick,
                                    },
                                    
                                    
                                    
                                    // children:
                                    deleteButtonComponent.props.children ?? deleteButtonText,
                                )}
                            </>}
                            
                            {/* <RetryButton> + <CancelButton> */}
                            {!!uploadingImage && <>
                                {/* <RetryButton> */}
                                {isError && React.cloneElement<ButtonProps>(retryButtonComponent,
                                    // props:
                                    {
                                        // classes:
                                        className : retryButtonComponent.props.className ?? 'retryButton',
                                        
                                        
                                        
                                        // handlers:
                                        onClick   : retryButtonHandleClick,
                                    },
                                    
                                    
                                    
                                    // children:
                                    retryButtonComponent.props.children ?? uploadingImageRetryText,
                                )}
                                
                                {/* <CancelButton> */}
                                {React.cloneElement<ButtonProps>(cancelButtonComponent,
                                    // props:
                                    {
                                        // classes:
                                        className : cancelButtonComponent.props.className ?? 'cancelButton',
                                        
                                        
                                        
                                        // handlers:
                                        onClick   : cancelButtonHandleClick,
                                    },
                                    
                                    
                                    
                                    // children:
                                    cancelButtonComponent.props.children ?? uploadingImageCancelText,
                                )}
                            </>}
                        </>,
                    )}
                    
                    {!readOnly && <input
                        // refs:
                        ref={inputFileRef}
                        
                        
                        
                        // classes:
                        className='inputFile'
                        
                        
                        
                        // formats:
                        type='file'
                        accept={uploadImageType}
                        multiple={false}
                        
                        
                        
                        // handlers:
                        onChange={inputFileHandleChange}
                    />}
                </>,
            )}
        </AccessibilityProvider>
    );
};
export {
    UploadImage,
    UploadImage as default,
}
