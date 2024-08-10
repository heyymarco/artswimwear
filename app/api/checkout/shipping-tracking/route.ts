// models:
import {
    type ShippingTrackingDetail,
    
    
    
    shippingTrackingDetailSelect,
}                           from '@/models'

// ORMs:
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
        shippingTracking,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((typeof(shippingTracking) !== 'object')) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const shippingTrackingToken = shippingTracking.token;
    if (!shippingTrackingToken || (typeof(shippingTrackingToken) !== 'string')) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const {
        preferredTimezone,
    } = shippingTracking;
    if ((preferredTimezone !== undefined) && (preferredTimezone !== null) && (typeof(preferredTimezone) !== 'number') && !isFinite(preferredTimezone) && !possibleTimezoneValues.includes(preferredTimezone)) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    const shippingTrackingDetailData = (
        (preferredTimezone === undefined)
        ? await prisma.shippingTracking.findUnique({
            where  : {
                token : shippingTrackingToken,
            },
            select : shippingTrackingDetailSelect,
        })
        : await prisma.$transaction(async (prismaTransaction) => {
            const shippingTrackingData = await prismaTransaction.shippingTracking.findUnique({
                where  : {
                    token : shippingTrackingToken,
                },
                select : {
                    // records:
                    id               : true,
                    
                    // relations:
                    order : {
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
            if (!shippingTrackingData) return null;
            
            
            
            const {
                id    : shippingTrackingId,
                order : orderData,
            } = shippingTrackingData;
            const customerPreferenceId = orderData.customer?.preference?.id;
            const guestPreferenceId    = orderData.guest?.preference?.id;
            return await prismaTransaction.shippingTracking.update({
                where  : {
                    id : shippingTrackingId,
                },
                data   : {
                    order : (
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
                select : shippingTrackingDetailSelect,
            });
        })
    );
    if (!shippingTrackingDetailData) {
        return Response.json({
            error: 'Invalid shipping tracking token.',
        }, { status: 400 }); // handled with error
    } // if
    
    // sort the log by reported date:
    const {
        // relations:
        order : orderData,
        
        
        
        // data:
        ...restshippingTrackingDetail
    } = shippingTrackingDetailData;
    const shippingTrackingDetail : ShippingTrackingDetail = {
        ...restshippingTrackingDetail,
        preferredTimezone : orderData.customer?.preference?.timezone ?? orderData.guest?.preference?.timezone ?? checkoutConfigServer.intl.defaultTimezone,
    };
    shippingTrackingDetail.shippingTrackingLogs.sort(({reportedAt: a}, {reportedAt: b}) => {
        if ((a === null) || (b === null)) return 0;
        return a.valueOf() - b.valueOf();
    });
    
    return Response.json(shippingTrackingDetail); // handled with success
}
