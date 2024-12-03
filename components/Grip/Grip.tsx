// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    IndicatorProps,
    Indicator,
}                           from '@reusable-ui/indicator'       // a base component

// styles:
import {
    useGripStyleSheet,
}                           from './styles/loader'



// react components:
export interface GripProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<IndicatorProps<TElement>,
            |'children' // no nested children
        >
{
}
const Grip = <TElement extends Element = HTMLElement>(props: GripProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,
        
        
        
        // handlers:
        onMouseDown,
        onTouchStart,
        
        
        
        // other props:
        ...restGripProps
    } = props;
    
    
    
    // styles:
    const styleSheet   = useGripStyleSheet();
    
    
    
    // refs:
    const gripRef      = useRef<TElement|null>(null);
    const mergedElmRef = useMergeRefs(
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        gripRef,
    );
    
    
    
    // states:
    const [requiredDots, setRequiredDots] = useState<number>(0);
    const [isGrabbed   , setIsGrabbed   ] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleGrabbed    = useEvent((event: React.MouseEvent<TElement, MouseEvent> | React.TouchEvent<TElement>): void => {
        // actions:
        setIsGrabbed(
            ('buttons' in event)
            ? (event.buttons        === 1) // must ONLY left_button is pressed, otherwise auto released
            : (event.touches.length === 1) // must ONLY single touched        , otherwise auto released
        );
    });
    
    const handleMouseDown  = useMergeEvents(
        // preserves the original `onMouseDown` from `props`:
        onMouseDown,
        
        
        
        // states:
        handleGrabbed,
    );
    const handleTouchStart = useMergeEvents(
        // preserves the original `onTouchStart` from `props`:
        onTouchStart,
        
        
        
        // states:
        handleGrabbed,
    );
    
    
    
    // effects:
    
    // observes for <Grip>'s resize => change `setRequiredDots()`:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const gripElm = gripRef.current;
        if (!gripElm) return; // no <Grip> element is attached => nothing to observe => ignore
        
        
        
        // setups:
        const observer = new ResizeObserver((entries) => {
            const style = getComputedStyle(gripElm);
            const gridTemplateColumns = style.gridTemplateColumns.split(/\s+/g).length;
            const gridTemplateRows    = style.gridTemplateRows.split(/\s+/g).length;
            setRequiredDots(gridTemplateColumns * gridTemplateRows);
        });
        observer.observe(gripElm, { box: 'content-box' });
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, []);
    
    // watchdog for mouse|touch release => change `setIsGrabbed()`:
    useEffect(() => {
        // conditions:
        if (!isGrabbed) return; // not being grabbed => nothing to release => ignore
        
        
        
        // handlers:
        const handleRelease = (): void => {
            // actions:
            setIsGrabbed(false); // previous mouse|touch is distrupted (the number of buttons|touches are changed) => auto released
        };
        
        
        
        // setups:
        window.addEventListener('mouseup'    , handleRelease);
        window.addEventListener('touchend'   , handleRelease);
        window.addEventListener('touchcancel', handleRelease);
        
        
        
        // cleanups:
        return () => {
            window.removeEventListener('mouseup'    , handleRelease);
            window.removeEventListener('touchend'   , handleRelease);
            window.removeEventListener('touchcancel', handleRelease);
        };
    }, [isGrabbed]);
    
    
    
    // default props:
    const {
        // semantics:
        // @ts-ignore
        'aria-grabbed' : ariaGrabbed = isGrabbed,       // defaults to `isGrabbed` state
        
        
        
        // variants:
        nude                         = true,            // defaults to nude
        mild                         = true,            // defaults to mild
        
        
        
        // classes:
        mainClass                    = styleSheet.main, // defaults to internal styleSheet
        
        
        
        // children:
        children                     = (new Array(requiredDots)).fill(null).map((_item, index) =>
            <span key={index} />
        ),                                              // defaults to dotted children
        
        
        
        // other props:
        ...restIndicatorProps
    } = restGripProps as (typeof restGripProps & React.PropsWithChildren<{}>);
    
    
    
    // jsx:
    return (
        <Indicator<TElement>
            // other props:
            {...restIndicatorProps}
            
            
            
            // semantics:
            // @ts-ignore
            aria-grabbed={ariaGrabbed}
            
            
            
            // refs:
            elmRef={mergedElmRef}
            
            
            
            // variants:
            nude={nude}
            mild={mild}
            
            
            
            // classes:
            mainClass={mainClass}
            
            
            
            // handlers:
            onMouseDown  = {handleMouseDown }
            onTouchStart = {handleTouchStart}
        >
            {children}
        </Indicator>
    );
};
export {
    Grip,            // named export for readibility
    Grip as default, // default export to support React.lazy
}



export interface GripComponentProps<TElement extends Element = HTMLElement>
{
    // components:
    gripComponent ?: React.ReactComponentElement<any, GripProps<TElement>>
}
