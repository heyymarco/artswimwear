// models:
import {
    type PaymentConfirmationDetail,
    
    
    
    paymentConfirmationDetailSelect,
}                           from '@/models'

// ORMs:
import {
    Prisma,
}                           from '@prisma/client'
import {
    prisma,
}                           from '@/libs/prisma.server'

// utilities:
import {
    possibleTimezoneValues,
}                           from '@/components/editors/TimezoneEditor/types'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';



export const POST = async (req: Request): Promise<Response> => {
    //#region parsing request
    const {
        token,
        
        amount,
        payerName,
        paymentDate,
        preferredTimezone,
        
        originatingBank,
        destinationBank,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (!token || (typeof(token) !== 'string')) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    if ((amount !== undefined) && ((typeof(amount) !== 'number') || (amount < 0) || !isFinite(amount))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if (((payerName !== undefined) && (payerName !== null)) && ((typeof(payerName) !== 'string') || (payerName.length < 2) || (payerName.length > 50))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    let paymentDateAsDate : Date|undefined = undefined;
    if ((paymentDate !== undefined) && (paymentDate !== null) && ((typeof(paymentDate) !== 'string') || !paymentDate.length || !(paymentDateAsDate = ((): Date|undefined => {
        try {
            return new Date(paymentDate);
        }
        catch {
            return undefined;
        } // try
    })()))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((preferredTimezone !== undefined) && (preferredTimezone !== null) && (typeof(preferredTimezone) !== 'number') && !isFinite(preferredTimezone) && !possibleTimezoneValues.includes(preferredTimezone)) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if (((originatingBank !== undefined) && (originatingBank !== null)) && ((typeof(originatingBank) !== 'string') || (originatingBank.length < 2) || (originatingBank.length > 50))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if (((destinationBank !== undefined) && (destinationBank !== null)) && ((typeof(destinationBank) !== 'string') || (destinationBank.length < 2) || (destinationBank.length > 50))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    const paymentConfirmationDetailRaw = (
        (amount === undefined)
        ? await prisma.paymentConfirmation.findUnique({
            where  : {
                token : token,
            },
            select : paymentConfirmationDetailSelect,
        })
        : await (async() => {
            try {
                const paymentConfirmationDetailData = await prisma.$transaction(async (prismaTransaction) => {
                    const paymentConfirmationData = await prismaTransaction.paymentConfirmation.findUnique({
                        where  : {
                            token : token,
                            
                            OR : [
                                { reviewedAt      : { equals : null          } }, // never approved or rejected
                                
                                /* -or- */
                                
                                { rejectionReason : { not    : Prisma.DbNull } }, // has reviewed as rejected (prevents to confirm the *already_approved_payment_confirmation*)
                            ],
                        },
                        select : {
                            // records:
                            id               : true,
                            
                            // relations:
                            parent : {
                                select : {
                                    customer : {
                                        select : {
                                            preference : {
                                                select : {
                                                    id : true,
                                                },
                                            },
                                        },
                                    },
                                    guest    : {
                                        select : {
                                            preference : {
                                                select : {
                                                    id : true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                    if (!paymentConfirmationData) return null;
                    
                    
                    
                    const {
                        id     : paymentConfirmationId,
                        parent : orderData,
                    } = paymentConfirmationData;
                    const customerPreferenceId = orderData.customer?.preference?.id;
                    const guestPreferenceId    = orderData.guest?.preference?.id;
                    return await prismaTransaction.paymentConfirmation.update({
                        where  : {
                            id : paymentConfirmationId,
                        },
                        data   : {
                            reportedAt : new Date(), // set the confirmation date
                            reviewedAt : null, // reset for next review
                            
                            amount,
                            payerName,
                            paymentDate      : paymentDateAsDate,
                            
                            originatingBank,
                            destinationBank,
                            
                            rejectionReason : Prisma.DbNull, // reset for next review
                            
                            parent : (
                                (!customerPreferenceId && !guestPreferenceId)
                                ? undefined
                                : (
                                    customerPreferenceId
                                    ? {
                                        update : {
                                            customer : {
                                                update : {
                                                    preference : {
                                                        update : {
                                                            timezone : preferredTimezone,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }
                                    : {
                                        update : {
                                            guest : {
                                                update : {
                                                    preference : {
                                                        update : {
                                                            timezone : preferredTimezone,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }
                                )
                            ),
                        },
                        select : paymentConfirmationDetailSelect,
                    });
                });
                return paymentConfirmationDetailData;
            }
            catch (error: any) {
                console.log('ERROR: ', error, {amount, token});
                if (error?.code === 'P2025') return 'ALREADY_APPROVED';
                throw error;
            } // try
        })()
    );
    if (paymentConfirmationDetailRaw === 'ALREADY_APPROVED') {
        return Response.json({
            error:
`The previous payment confirmation has been approved.

Updating the confirmation is not required.`,
        }, { status: 409 }); // handled with conflict error
    }
    if (!paymentConfirmationDetailRaw) {
        return Response.json({
            error: 'Invalid payment confirmation token.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    // notify a payment confirmation has been received to adminApp via webhook:
    if (amount !== undefined) { // only for update request, ignore for getter request
        await fetch(`${process.env.ADMIN_APP_URL ?? ''}/api/webhooks/checkouts/confirmed`, {
            method  : 'POST',
            headers : {
                'X-Secret' : process.env.APP_SECRET ?? '',
            },
            body    : JSON.stringify({
                token : token,
            }),
        });
    } // if
    
    
    
    const {
        // relations:
        parent : orderData,
        
        
        
        // data:
        ...restPaymentConfirmationDetail
    } = paymentConfirmationDetailRaw;
    return Response.json({
        ...restPaymentConfirmationDetail,
        currency : orderData.currency?.currency ?? checkoutConfigServer.intl.defaultCurrency,
        preferredTimezone : orderData.customer?.preference?.timezone ?? orderData.guest?.preference?.timezone ?? checkoutConfigServer.intl.defaultTimezone,
    } satisfies PaymentConfirmationDetail); // handled with success
}
