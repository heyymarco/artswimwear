'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useState,
    useEffect,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useMergeClasses,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
    
    
    
    // simple-components:
    IconList,
    SizeName,
    IconProps,
    Icon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals:
import {
    // variants:
    ProfileImageVariant,
    useProfileImageVariant,
}                           from './variants/ProfileImageVariant'



// defaults:
const _defaultIcon     : IconList = 'person';
const _defaultIconSize : SizeName = 'lg';



// styles:
import './styles/styles';
export const useProfileImageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'm2io1cjr4u' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// caches:
const validProfileImageCache = new Map<string, boolean>();



// react components:
export interface ProfileImageProps
    extends
        // bases:
        BasicProps,
        Omit<IconProps, 'icon'|'size'>,
        Pick<Partial<IconProps>, 'icon'>,
        
        // variants:
        ProfileImageVariant
{
    // appearances:
    src ?: string
    
    
    
    // variants:
    iconSize ?: IconProps['size']
}
const ProfileImage = (props: ProfileImageProps): JSX.Element|null => {
    // styles:
    const styleSheet = useProfileImageStyleSheet();
    
    
    
    // variants:
    const profileImageVariant = useProfileImageVariant(props);
    
    
    
    // rest props:
    const {
        // appearances:
        src,                                    // take
        icon = _defaultIcon,                    // take
        
        
        
        // variants:
        profileImageStyle : _profileImageStyle, // remove
        iconSize          = _defaultIconSize,   // take
    ...restBasicProps} = props;
    
    
    
    // states:
    const [hasValidImage, setHasValidImage] = useState<boolean>((src ? validProfileImageCache.get(src) : undefined) ?? false);
    
    
    
    // classes:
    const classes        = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        styleSheet.main, // additional styleSheet
    );
    const variantClasses = useMergeClasses(
        // preserves the original `variantClasses`:
        props.variantClasses,
        
        
        
        // variants:
        profileImageVariant.class,
    );
    const stateClasses   = useMergeClasses(
        // preserves the original `stateClasses`:
        props.stateClasses,
        
        
        
        // states:
        (hasValidImage ? 'hasImage' : null),
    );
    
    
    
    // styles:
    const backgroundImageStyle = useMemo<React.CSSProperties|undefined>(() => {
        if (!src) return undefined;
        return {
            backgroundImage: `url("${src}")`,
        };
    }, [src]);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    useEffect(() => {
        // conditions:
        if (!src) { // no image => no need to verify
            setHasValidImage(false); // reset
            return;
        } // if
        
        
        
        // actions:
        const isImageValidCache = validProfileImageCache.get(src);
        if (isImageValidCache !== undefined) {
            setHasValidImage(isImageValidCache);
        }
        else {
            setHasValidImage(false); // reset
            (async () => {
                try {
                    const response = await fetch(src, { method: 'HEAD' });
                    if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                    if (response.ok) { // verified
                        validProfileImageCache.set(src, true);
                        setHasValidImage(true);
                    } // if
                }
                catch {
                    // error => invalid image
                    validProfileImageCache.set(src, false);
                } // try
            })();
        } // if
    }, [src]);
    
    
    
    // jsx:
    return (
        <Basic
            // other props:
            {...restBasicProps}
            
            
            
            // classes:
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
        >
            <Icon
                // appearances:
                icon={icon}
                
                
                
                // variants:
                size={iconSize}
                
                
                
                // styles:
                style={backgroundImageStyle}
            />
        </Basic>
    );
};
export {
    ProfileImage,
    ProfileImage as default,
}