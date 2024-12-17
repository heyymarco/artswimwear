'use client'

// styles:
import {
    usePaymentMethodIdentifierStyleSheet,
}                           from './styles/loader'

// models:
import {
    type PaymentDetail,
    type PaymentMethodDetail,
}                           from '@/models'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    type BasicProps,
    Basic,
}                           from '@reusable-ui/basic'           // a base component



// react components:
export interface PaymentMethodIdentifierProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<BasicProps<TElement>,
            |'children' // no nested children
        >
{
    // data:
    model ?: Pick<PaymentDetail|PaymentMethodDetail, 'type'|'identifier'>|null|undefined
}
const PaymentMethodIdentifier = <TElement extends Element = HTMLElement>(props: PaymentMethodIdentifierProps<TElement>): JSX.Element|null => {
    // jsx:
    const model = props.model;
    if (!model) return null;
    return (
        <ImplementedPaymentMethodIdentifier {...props} model={model} />
    );
};
const ImplementedPaymentMethodIdentifier = <TElement extends Element = HTMLElement>(props: PaymentMethodIdentifierProps<TElement> & { model: Exclude<PaymentMethodIdentifierProps['model'], null|undefined> }): JSX.Element|null => {
    // styles:
    const styles = usePaymentMethodIdentifierStyleSheet();
    
    
    
    // props:
    const {
        // model:
        model : {
            type,
            identifier,
        },
        
        
        
        // other props:
        ...restPaymentMethodIdentifierProps
    } = props;
    const identifierLast4 = identifier?.slice(-4); // get the last 4 characters
    
    
    
    // default props:
    const {
        // semantics:
        tag       = 'span',
        
        
        
        // variants:
        theme     = 'primary',
        mild      = true,
        nude      = true,
        
        
        
        // classes:
        mainClass = styles.main,
        
        
        
        // other props:
        ...restBasicProps
    } = restPaymentMethodIdentifierProps;
    
    
    
    // jsx:
    if (!identifier) return null;
    return (
        <Basic<TElement>
            // other props:
            {...restBasicProps}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // variants:
            theme={theme}
            mild={mild}
            nude={nude}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            {/* identifier for credit card: */}
            {(type === 'CARD') && <span
                // semantics:
                role='text'
                aria-label={`Credit card ending in ${identifierLast4}`}
                
                
                
                // classes:
                className={styles.masks}
            >
                <span aria-hidden='true' className={styles.mask}>••••</span>
                <span aria-hidden='true' className={styles.mask}>••••</span>
                <span aria-hidden='true' className={styles.mask}>••••</span>
                <span className={styles.last4}>{identifierLast4}</span>
            </span>}
            
            
            
            {/* identifier for other payment methods: */}
            {(type !== 'CARD') && <span
                // semantics:
                role='text'
                aria-label={`Payment method in ${identifier}`}
                
                
                
                // classes:
                className={styles.mayLongText}
            >
                {identifier}
            </span>}
        </Basic>
    );
};
export {
    PaymentMethodIdentifier,            // named export for readibility
    PaymentMethodIdentifier as default, // default export to support React.lazy
}
