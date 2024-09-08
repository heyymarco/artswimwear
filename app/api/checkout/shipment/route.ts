// models:
import {
    type ShipmentDetail,
    
    
    
    shipmentDetailSelect,
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
        token,
        preferredTimezone,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (!token || (typeof(token) !== 'string')) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    if ((preferredTimezone !== undefined) && (preferredTimezone !== null) && (typeof(preferredTimezone) !== 'number') && !isFinite(preferredTimezone) && !possibleTimezoneValues.includes(preferredTimezone)) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    const shipmentDetailData = (
        (preferredTimezone === undefined)
        ? await prisma.shipment.findUnique({
            where  : {
                // data:
                token : token,
            },
            select : shipmentDetailSelect,
        })
        : await prisma.$transaction(async (prismaTransaction) => {
            const relatedShipment = await prismaTransaction.shipment.findUnique({
                where  : {
                    // data:
                    token : token,
                },
                select : {
                    // records:
                    id               : true,
                    
                    // relations:
                    parent : {
                        select : {
                            guest    : {
                                select : {
                                    preference : {
                                        select : {
                                            id : true,
                                        },
                                    },
                                },
                            },
                            customer : {
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
            if (!relatedShipment) return null;
            
            
            
            const {
                id     : shipmentId,
                parent : orderData,
            } = relatedShipment;
            const customerPreferenceId = orderData.customer?.preference?.id;
            const guestPreferenceId    = orderData.guest?.preference?.id;
            return await prismaTransaction.shipment.update({
                where  : {
                    // records:
                    id : shipmentId,
                },
                data   : {
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
                select : shipmentDetailSelect,
            });
        })
    );
    if (!shipmentDetailData) {
        return Response.json({
            error: 'Invalid shipping tracking token.',
        }, { status: 400 }); // handled with error
    } // if
    
    // sort the log by reported date:
    const {
        // relations:
        parent : orderData,
        
        
        
        // data:
        ...restShipmentDetail
    } = shipmentDetailData;
    const shipmentDetail : ShipmentDetail = {
        ...restShipmentDetail,
        preferredTimezone : orderData.customer?.preference?.timezone ?? orderData.guest?.preference?.timezone ?? checkoutConfigServer.intl.defaultTimezone,
    };
    shipmentDetail.logs.sort(({reportedAt: a}, {reportedAt: b}) => {
        if ((a === null) || (b === null)) return 0;
        return a.valueOf() - b.valueOf();
    });
    
    return Response.json(shipmentDetail); // handled with success
}
