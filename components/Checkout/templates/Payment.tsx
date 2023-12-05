// react:
import {
    // react:
    default as React,
}                           from 'react'

// lexical functions:
import {
    createHeadlessEditor,
}                           from '@lexical/headless'
import {
    $generateHtmlFromNodes,
}                           from '@lexical/html'

// types:
import type {
    // types:
    WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// // theme:
// import {
//     // defined classes to match Reusable-UI's styles & components.
//     defaultTheme,
// }                           from '@/components/editors/WysiwygEditor/defaultTheme'

// nodes:
import {
    // defined supported nodes.
    defaultNodes,
}                           from '@/components/editors/WysiwygEditor/defaultNodes'

// styles:
import * as styles          from '@/components/Checkout/templates/styles'

// internals:
import {
    // hooks:
    useBusinessContext,
}                           from './businessDataContext'
import {
    // hooks:
    usePaymentContext,
}                           from './paymentDataContext'
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'



// react components:

const BillingAddress = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                billingAddress : address,
            },
        },
        
        
        
        // relation data:
        countryList,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!address) return null;
    const {
        // billing data:
        firstName : billingFirstName,
        lastName  : billingLastName,
        
        phone     : billingPhone,
        
        address   : billingAddress,
        city      : billingCity,
        zone      : billingZone,
        zip       : billingZip,
        country   : billingCountry,
    } = address;
    return (
        <>
            <p style={styles.paragraphFirst}>
                {billingFirstName} {billingLastName} ({billingPhone})
            </p>
            
            <p style={styles.paragraphLast}>
                {`${billingAddress}, ${billingCity}, ${billingZone} (${billingZip}), ${countryList?.entities?.[billingCountry ?? '']?.name}`}
            </p>
        </>
    );
};
const PaymentMethod = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                // payment data:
                type       : paymentType,
                brand      : paymentBrand,
                identifier : paymentIdentifier,
            },
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <>
            <p
                // styles:
                style={{
                    // layouts:
                    ...styles.paragraphBase,
                    display   : 'flex',
                    
                    
                    
                    // spacings:
                    columnGap : '0.5em',
                }}
            >
                {
                    !!paymentBrand
                    ? <>{paymentBrand.toUpperCase()}</>
                    : (paymentType?.toUpperCase() ?? paymentType)
                }
                
                {!!paymentIdentifier && <span style={styles.textSmall}>
                    ({paymentIdentifier})
                </span>}
            </p>
        </>
    );
};
const PaymentAmount = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                // payment data:
                amount : paymentAmount,
            },
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <>
            <p style={styles.paragraphCurrency}>
                <span
                    // styles:
                    style={{
                        // typos:
                        ...styles.textBold,
                        // ...styles.numberCurrency, // no need to place right_most
                    }}
                >
                    {formatCurrency(paymentAmount)}
                </span>
            </p>
        </>
    );
};


export interface PaymentInfoProps {
    // styles:
    style    ?: React.CSSProperties
    
    
    
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const PaymentInfo = (props: PaymentInfoProps): React.ReactNode => {
    // rest props:
    const {
        // styles:
        style,
        
        
        
        // accessibilities:
        title,
    } = props;
    
    
    
    // contexts:
    const {
        // data:
        order : {
            payment : {
                type           : paymentType,
                
                billingAddress : address,
            },
        },
    } = useOrderDataContext();
    const isManualPayment = (paymentType === 'MANUAL_PAID');
    
    
    
    // jsx:
    return (
        <table
            // styles:
            style={{
                ...styles.tableInfo,
                ...style,
            }}
        >
            {!!title && <thead>
                <tr>
                    <th colSpan={2} style={styles.tableTitleCenter}>
                        {title}
                    </th>
                </tr>
            </thead>}
            
            <tbody>
                <tr>
                    <th
                        // styles:
                        style={{
                            // layouts:
                            ...(title                        ? null                    : styles.borderTopSide        ),
                            ...(title                        ? null                    : styles.tableTitleSideFirst  ),
                            ...((address || isManualPayment) ? styles.tableTitleSide   : styles.tableTitleSideLast   ),
                        }}
                    >
                        Payment Method
                    </th>
                    <td
                        // styles:
                        style={{
                            // layouts:
                            ...(title                        ? null                    : styles.borderTopSide        ),
                            ...(title                        ? null                    : styles.tableContentSideFirst),
                            ...((address || isManualPayment) ? styles.tableContentSide : styles.tableContentSideLast ),
                        }}
                    >
                        <PaymentMethod />
                    </td>
                </tr>
                
                {isManualPayment && <tr>
                    <th
                        // styles:
                        style={{
                            // layouts:
                            ...(address                      ? styles.tableTitleSide   : styles.tableTitleSideLast   ),
                        }}
                    >
                        Payment Amount
                    </th>
                    <td
                        // styles:
                        style={{
                            // layouts:
                            ...(address                      ? styles.tableContentSide : styles.tableContentSideLast ),
                        }}
                    >
                        <PaymentAmount />
                    </td>
                </tr>}
                
                {!!address && <tr>
                    <th style={styles.tableTitleSideLast}>
                        Billing Address
                    </th>
                    <td style={styles.tableContentSideLast}>
                        <BillingAddress />
                    </td>
                </tr>}
            </tbody>
        </table>
    );
};

const PaymentBank = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        model,
    } = usePaymentContext();
    
    
    
    // jsx:
    return (
        model?.bank ?? null
    );
};
const PaymentConfirmationUrl = (): string|null => {
    // contexts:
    const {
        // data:
        model : business,
    } = useBusinessContext();
    
    const {
        // data:
        model,
    } = usePaymentContext();
    
    const {
        // data:
        order : {
            orderId,
        },
    } = useOrderDataContext();
    
    
    
    const baseUrl                 = business?.url;
    const relativeConfirmationUrl = model?.confirmationUrl;
    const absoluteConfirmationUrl = `${relativeConfirmationUrl?.startsWith('/') ? baseUrl : ''}${relativeConfirmationUrl}`;
    const absoluteConfirmationUrlWithId = `${absoluteConfirmationUrl}?orderId=${encodeURIComponent(orderId)}`;
    
    
    
    // jsx:
    return (
        absoluteConfirmationUrlWithId
    );
};
const PaymentConfirmationLink = (): React.ReactNode => {
    const url = PaymentConfirmationUrl();
    
    
    
    // jsx:
    if (!url) return null;
    return (
        <a href={url}>
            {url}
        </a>
    );
};
export const PaymentConfirmationRejection = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        paymentConfirmation,
    } = useOrderDataContext();
    const rejectionReason = paymentConfirmation?.rejectionReason;
    
    
    
    const editor = createHeadlessEditor({
        namespace   : 'WysiwygEditor', 
        editable    : false,
        
        editorState : (rejectionReason ?? undefined) as WysiwygEditorState|undefined,
        
        // theme       : defaultTheme(), // no need className(s) because email doesn't support styling
        nodes       : defaultNodes(),
    });
    
    
    
    // jsx:
    if (!rejectionReason) return null;
    return (
        // $generateHtmlFromNodes(editor) ?? null
        JSON.stringify(rejectionReason)
    );
};


export const Payment = {
    BillingAddress        : BillingAddress,
    Method                : PaymentMethod,
    Amount                : PaymentAmount,
    Info                  : PaymentInfo,
    
    Bank                  : PaymentBank,
    ConfirmationUrl       : PaymentConfirmationUrl,
    ConfirmationLink      : PaymentConfirmationLink,
    ConfirmationRejection : PaymentConfirmationRejection,
};
