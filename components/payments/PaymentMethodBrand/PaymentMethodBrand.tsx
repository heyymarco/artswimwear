'use client'

// styles:
import {
    usePaymentMethodBrandStyleSheet,
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

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internals:
import {
    getBrandName,
    getBrandLogo,
}                           from './utilities'



// react components:
export interface PaymentMethodBrandProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<BasicProps<TElement>,
            |'children' // no nested children
        >
{
    // data:
    model ?: Pick<PaymentDetail|PaymentMethodDetail, 'brand'>|null|undefined
}
const PaymentMethodBrand = <TElement extends Element = HTMLElement>(props: PaymentMethodBrandProps<TElement>): JSX.Element|null => {
    // jsx:
    const model = props.model;
    if (!model) return null;
    return (
        <ImplementedPaymentMethodBrand {...props} model={model} />
    );
};
const ImplementedPaymentMethodBrand = <TElement extends Element = HTMLElement>(props: PaymentMethodBrandProps<TElement> & { model: Exclude<PaymentMethodBrandProps['model'], null|undefined> }): JSX.Element|null => {
    // styles:
    const styles = usePaymentMethodBrandStyleSheet();
    
    
    
    // props:
    const {
        // model:
        model,
        
        
        
        // other props:
        ...restPaymentMethodBrandProps
    } = props;
    const brand     = model?.brand;
    const brandLogo = (brand ? getBrandLogo(brand) : null);
    const brandName = (brand ? getBrandName(brand) : null) ?? brand;
    
    
    
    // default props:
    const {
        // variants:
        theme     = 'light',
        mild      = true,
        
        
        
        // classes:
        mainClass = styles.main,
        
        
        
        // other props:
        ...restBasicProps
    } = restPaymentMethodBrandProps;
    
    
    
    // jsx:
    return (
        <Basic<TElement>
            // other props:
            {...restBasicProps}
            
            
            
            // variants:
            theme={theme}
            mild={mild}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            {/* first priority: use brand logo: */}
            {!!brandLogo && <Image
                // appearances:
                src={brandLogo}
                
                
                
                // classes:
                className={styles.logo}
                
                
                
                // accessibilities:
                alt={brandName ?? ''}
                
                
                
                // behaviors:
                loading='eager'
            />}
            
            
            
            {/* second priority: use brand name: */}
            {!brandLogo && !!brandName && <span
                // classes:
                className={styles.name}
            >
                {brandName}
            </span>}
        </Basic>
    );
};
export {
    PaymentMethodBrand,            // named export for readibility
    PaymentMethodBrand as default, // default export to support React.lazy
}
