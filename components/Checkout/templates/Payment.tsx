// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // writes css in javascript:
    startsCapitalized,
}                           from '@cssfn/core'                  // writes css in javascript

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

// internal components:
import {
    DateTimeDisplay,
}                           from '@/components/DateTimeDisplay'

// nodes:
import {
    // defined supported nodes.
    defaultNodes,
}                           from '@/components/editors/WysiwygEditor/defaultNodes'

// internals:
import * as styles          from './styles'
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
import {
    // react components:
    CurrencyDisplay,
}                           from './CurrencyDisplay'



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
                    (paymentBrand || paymentType)
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
                    <CurrencyDisplay amount={paymentAmount} />
                </span>
            </p>
        </>
    );
};


export interface PaymentInfoProps {
    // styles:
    style ?: React.CSSProperties
    
    
    
    // accessibilities:
    title ?: React.ReactNode
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
        paymentConfirmation,
    } = useOrderDataContext();
    const paymentConfirmationToken = paymentConfirmation?.token;
    
    
    
    const baseUrl                          = business?.url;
    const relativeConfirmationUrl          = model?.confirmationUrl;
    const absoluteConfirmationUrl          = `${relativeConfirmationUrl?.startsWith('/') ? baseUrl : ''}${relativeConfirmationUrl}`;
    const absoluteConfirmationUrlWithToken = `${absoluteConfirmationUrl}?token=${encodeURIComponent(paymentConfirmationToken ?? '')}`;
    
    
    
    // jsx:
    return (
        absoluteConfirmationUrlWithToken
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
export const PaymentHasConfirmationRejection = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        paymentConfirmation,
    } = useOrderDataContext();
    const rejectionReason = paymentConfirmation?.rejectionReason;
    
    
    
    // jsx:
    if (!rejectionReason) return null;
    return props.children;
};

export const PaymentIsManualTransfer = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                type       : paymentType,
                identifier : paymentIndentifier,
                brand      : paymentBrand,
            }
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (paymentType !== 'MANUAL') return null;
    if (paymentIndentifier      ) return null;
    if (paymentBrand            ) return null;
    return props.children;
};
export const PaymentIsManualOtc = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                type       : paymentType,
                identifier : paymentIndentifier,
                brand      : paymentBrand,
            }
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (paymentType !== 'MANUAL') return null;
    if (!paymentIndentifier     ) return null;
    if (!paymentBrand           ) return null;
    return props.children;
};
export const PaymentOtcBrand = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                type       : paymentType,
                identifier : paymentIndentifier,
                brand      : paymentBrand,
            }
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (paymentType !== 'MANUAL') return null;
    if (!paymentIndentifier     ) return null;
    if (!paymentBrand           ) return null;
    return startsCapitalized(paymentBrand);
};
export const PaymentOtcCode = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                type       : paymentType,
                identifier : paymentIndentifier,
                brand      : paymentBrand,
            }
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (paymentType !== 'MANUAL') return null;
    if (!paymentIndentifier     ) return null;
    if (!paymentBrand           ) return null;
    return paymentIndentifier;
};

export const PaymentHasExpires = (props: React.PropsWithChildren<{}>): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                type       : paymentType,
                expiresAt  : paymentExpiresAt,
            }
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (paymentType !== 'MANUAL') return null;
    if (!paymentExpiresAt       ) return null;
    return props.children;
};
export const PaymentExpires = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                type       : paymentType,
                expiresAt  : paymentExpiresAt,
            }
        },
        customerOrGuest,
    } = useOrderDataContext();
    const {
        timezone,
    } = customerOrGuest?.preference ?? {};
    
    
    
    // jsx:
    if (paymentType !== 'MANUAL') return null;
    if (!paymentExpiresAt       ) return null;
    return (
        <DateTimeDisplay dateTime={paymentExpiresAt} timezone={timezone ?? undefined} showTimezone={true} />
    );
};

export interface PaymentConfirmationDetailsProps {
    // styles:
    style ?: React.CSSProperties
    
    
    
    // accessibilities:
    title ?: React.ReactNode
}
export const  PaymentConfirmationDetails = (props: PaymentConfirmationDetailsProps): React.ReactNode => {
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
        paymentConfirmation,
        customerOrGuest,
    } = useOrderDataContext();
    const {
        timezone,
    } = customerOrGuest?.preference ?? {};
    
    
    
    // jsx:
    if (!paymentConfirmation) return null;
    const {
        reportedAt,
        
        amount,
        payerName,
        paymentDate,
        
        originatingBank,
        destinationBank,
    } = paymentConfirmation;
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
                            ...(title ? null : styles.borderTopSide        ),
                            ...(title ? null : styles.tableTitleSideFirst  ),
                            ...styles.tableTitleSide,
                        }}
                    >
                        Reported At
                    </th>
                    <td
                        // styles:
                        style={{
                            // layouts:
                            ...(title ? null : styles.borderTopSide        ),
                            ...(title ? null : styles.tableContentSideFirst),
                            ...styles.tableContentSide,
                        }}
                    >
                        <DateTimeDisplay dateTime={reportedAt} timezone={timezone ?? undefined} showTimezone={true} />
                    </td>
                </tr>
                
                <tr>
                    <th style={styles.tableTitleSide}>
                        Amount
                    </th>
                    <td style={styles.tableContentSide}>
                        <CurrencyDisplay amount={amount} />
                    </td>
                </tr>
                
                <tr>
                    <th style={styles.tableTitleSide}>
                        Payer Name
                    </th>
                    <td style={styles.tableContentSide}>
                        {payerName || '-'}
                    </td>
                </tr>
                
                <tr>
                    <th style={styles.tableTitleSide}>
                        Transfered Date
                    </th>
                    <td style={styles.tableContentSide}>
                        {paymentDate ? <DateTimeDisplay dateTime={paymentDate} timezone={timezone ?? undefined} showTimezone={true} /> : '-'}
                    </td>
                </tr>
                
                <tr>
                    <th style={styles.tableTitleSide}>
                        Originating Bank
                    </th>
                    <td style={styles.tableContentSide}>
                        {originatingBank || '-'}
                    </td>
                </tr>
                
                <tr>
                    <th style={styles.tableTitleSideLast}>
                        Destination Bank
                    </th>
                    <td style={styles.tableContentSideLast}>
                        {destinationBank || '-'}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export const Payment = {
    BillingAddress           : BillingAddress,
    Method                   : PaymentMethod,
    Amount                   : PaymentAmount,
    Info                     : PaymentInfo,
    
    Bank                     : PaymentBank,
    ConfirmationUrl          : PaymentConfirmationUrl,
    ConfirmationLink         : PaymentConfirmationLink,
    ConfirmationRejection    : PaymentConfirmationRejection,
    HasConfirmationRejection : PaymentHasConfirmationRejection,
    
    IsManualTransfer         : PaymentIsManualTransfer,
    IsManualOtc              : PaymentIsManualOtc,
    OtcBrand                 : PaymentOtcBrand,
    OtcCode                  : PaymentOtcCode,
    
    HasExpires               : PaymentHasExpires,
    Expires                  : PaymentExpires,
    
    ConfirmationDetails      : PaymentConfirmationDetails,
};
