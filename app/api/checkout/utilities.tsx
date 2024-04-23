// react:
import type {
    ServerOptions,
}                           from 'react-dom/server'

// redux:
import {
    createEntityAdapter
}                           from '@reduxjs/toolkit'
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// webs:
import {
    default as nodemailer,
}                           from 'nodemailer'

// models:
import type {
    Customer,
    CustomerPreference,
    Guest,
    GuestPreference,
    
    Address,
    Payment,
    PreferredCurrency,
    OrdersOnProducts,
    DraftOrder,
    DraftOrdersOnProducts,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// apis:
import type {
    CountryPreview,
}                           from '@/app/api/countries/route'

// templates:
import {
    // react components:
    BusinessContextProviderProps,
    BusinessContextProvider,
}                           from '@/components/Checkout/templates/businessDataContext'
import {
    // types:
    CustomerOrGuestData,
    OrderAndData,
    
    
    
    // react components:
    OrderDataContextProviderProps,
    OrderDataContextProvider,
}                           from '@/components/Checkout/templates/orderDataContext'
import {
    // react components:
    PaymentContextProviderProps,
    PaymentContextProvider,
}                           from '@/components/Checkout/templates/paymentDataContext'
import {
    // react components:
    ShippingContextProviderProps,
    ShippingContextProvider,
}                           from '@/components/Checkout/templates/shippingDataContext'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    getMatchingShipping,
}                           from '@/libs/shippings'
import {
    downloadImageAsBase64,
}                           from '@/libs/images'

// configs:
import {
    checkoutConfig,
}                           from '@/checkout.config.server'



export const sumReducer = <TNumber extends number|null|undefined>(accum: TNumber, value: TNumber): TNumber => {
    if (typeof(value) !== 'number') return accum; // ignore null
    if (typeof(accum) !== 'number') return value; // ignore null
    return (accum + value) as TNumber;
}



export interface CreateDraftOrderData
    extends
        // bases:
        Omit<CreateOrderDataBasic,
            // extended data:
            |'payment'
            |'paymentConfirmationToken'
        >
{
    // temporary data:
    expiresAt       : Date
    paymentId       : string
    
    // extended data:
    customerOrGuest : CustomerOrGuestData
}
export const createDraftOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], createDraftOrderData: CreateDraftOrderData): Promise<string> => {
    // data:
    const {
        // temporary data:
        expiresAt,
        paymentId,
        
        // primary data:
        orderId,
        items,
        preferredCurrency,
        shippingAddress,
        shippingCost,
        shippingProviderId,
        
        // extended data:
        customerOrGuest,
    } = createDraftOrderData;
    const {
        preference: preferenceData,
    ...customerOrGuestData} = customerOrGuest;
    
    
    
    const newDraftOrder = await prismaTransaction.draftOrder.create({
        data : {
            // temporary data:
            
            expiresAt           : expiresAt,
            paymentId           : paymentId,
            
            // primary data:
            
            orderId             : orderId,
            
            items               : {
                create          : items,
            },
            
            preferredCurrency   : preferredCurrency,
            
            shippingAddress     : shippingAddress,
            shippingCost        : shippingCost,
            shippingProvider    : !shippingProviderId ? undefined : {
                connect         : {
                    id          : shippingProviderId,
                },
            },
            
            // extended data:
            
            // TODO: connect to existing customer
            // customer         : {
            //     connect      : {
            //         ...customerOrGuestData,
            //         customerPreference : {
            //             ...preferenceData,
            //         },
            //     },
            // },
            guest               : {
                create          : {
                    ...customerOrGuestData,
                    guestPreference : !preferenceData ? undefined : {
                        create  : preferenceData,
                    },
                },
            },
        },
        select : {
            id : true,
        },
    });
    return newDraftOrder.id;
}

export interface CancelDraftOrderData {
    orderId   ?: string|null
    paymentId ?: string|null
}
export const cancelDraftOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], cancelDraftOrderData: CancelDraftOrderData): Promise<boolean> => {
    // data:
    const {
        orderId   : orderIdRaw,
        paymentId : paymentIdRaw,
    } = cancelDraftOrderData;
    const orderId   = orderIdRaw   || undefined;
    const paymentId = paymentIdRaw || undefined;
    if (!orderId && !paymentId) return false;
    
    
    
    const requiredSelect = {
        id                     : true,
        
        orderId                : true,
        
        items : {
            select : {
                productId      : true,
                variantIds     : true,
                
                quantity       : true,
            },
        },
    };
    const draftOrder = await prismaTransaction.draftOrder.findUnique({
        where  : {
            orderId   : orderId,
            paymentId : paymentId,
        },
        select : requiredSelect,
    });
    if (!draftOrder) return false;
    
    
    
    // draftOrder CANCELED => restore the `Product` stock and delete the `draftOrder`:
    await revertOrder(prismaTransaction, { draftOrder });
    return true;
}

export interface FindDraftOrderData {
    orderId   ?: string|null
    paymentId ?: string|null
}
export const findDraftOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], findDraftOrderData: FindDraftOrderData): Promise<(CommitDraftOrder & RevertDraftOrder)|null> => {
    // data:
    const {
        orderId   : orderIdRaw,
        paymentId : paymentIdRaw,
    } = findDraftOrderData;
    const orderId   = orderIdRaw   || undefined;
    const paymentId = paymentIdRaw || undefined;
    if (!orderId && !paymentId) return null;
    
    
    
    const requiredSelect = {
        id                     : true,
        expiresAt              : true,
        
        orderId                : true,
        paymentId              : true,
        
        preferredCurrency      : true,
        
        shippingAddress        : true,
        shippingCost           : true,
        shippingProviderId     : true,
        
        customerId             : true,
        guestId                : true,
        // customer               : {
        //     select : {
        //         // data:
        //         name  : true,
        //         email : true,
        //     },
        // },
        // guest                  : {
        //     select : {
        //         // data:
        //         name  : true,
        //         email : true,
        //     },
        // },
        
        items : {
            select : {
                productId      : true,
                variantIds     : true,
                
                price          : true,
                shippingWeight : true,
                quantity       : true,
            },
        },
    };
    return await prismaTransaction.draftOrder.findUnique({
        where  : {
            orderId   : orderId,
            paymentId : paymentId,
        },
        select : requiredSelect,
    });
}

export interface CreateOrderDataBasic {
    // primary data:
    orderId                  : string
    paymentId                : string|null
    items                    : Omit<OrdersOnProducts,
        // records:
        |'id'
        
        // relations:
        |'orderId'
    >[]
    preferredCurrency        : PreferredCurrency|null
    shippingAddress          : Address|null
    shippingCost             : number|null
    shippingProviderId       : string|null
    
    // extended data:
    payment                  : Payment
    paymentConfirmationToken : string|null
}
export type CreateOrderData =
    &CreateOrderDataBasic
    &(
        |{
            // extended data:
            customerOrGuest  : CustomerOrGuestData
        }
        |{
            // extended data:
            customerId       : string|null
            guestId          : string|null
        }
    )
export const createOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], createOrderData: CreateOrderData): Promise<OrderAndData> => {
    // data:
    const {
        // primary data:
        orderId,
        paymentId = await (async (): Promise<string> => {
            const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
            return await nanoid();
        })(),
        items,
        preferredCurrency,
        shippingAddress,
        shippingCost,
        shippingProviderId,
        
        // extended data:
        payment,
        paymentConfirmationToken,
    } = createOrderData;
    
    
    
    const {customer, guest, ...newOrder} = await prismaTransaction.order.create({
        data   : {
            // primary data:
            
            orderId             : orderId,
            paymentId           : paymentId,
            
            items               : {
                create          : items,
            },
            
            preferredCurrency   : preferredCurrency,
            
            shippingAddress     : shippingAddress,
            shippingCost        : shippingCost,
            shippingProvider    : !shippingProviderId ? undefined : {
                connect         : {
                    id          : shippingProviderId,
                },
            },
            
            // extended data:
            
            ...(() => {
                if ('customerOrGuest' in createOrderData) {
                    const {
                        preference: preferenceData,
                    ...customerOrGuestData} = createOrderData.customerOrGuest;
                    
                    return {
                        // TODO: connect to existing customer
                        // customer         : {
                        //     connect      : {
                        //         ...customerOrGuestData,
                        //         customerPreference : {
                        //             ...preferenceData,
                        //         },
                        //     },
                        // },
                        guest               : {
                            create          : {
                                ...customerOrGuestData,
                                guestPreference : !preferenceData ? undefined : {
                                    create  : preferenceData,
                                },
                            },
                        },
                    };
                }
                else {
                    const {
                        customerId,
                        guestId,
                    } = createOrderData;
                    if (!!customerId) {
                        return {
                            customer : {
                                connect : {
                                    id: customerId,
                                },
                            },
                        };
                    }
                    else if (!!guestId) {
                        return {
                            guest : {
                                connect : {
                                    id: guestId,
                                },
                            },
                        };
                    }
                    else {
                        return {};
                    } // if
                }
            })(),
            
            payment             : payment,
            paymentConfirmation : !paymentConfirmationToken ? undefined : {
                create : {
                    token: paymentConfirmationToken,
                },
            },
        },
        include : {
            items : {
                select : {
                    // data:
                    price          : true,
                    shippingWeight : true,
                    quantity       : true,
                    
                    // relations:
                    product        : {
                        select : {
                            name   : true,
                            images : true,
                            
                            // relations:
                            variantGroups : {
                                select : {
                                    variants : {
                                        // always allow to access DRAFT variants when the customer is already ordered:
                                        // where    : {
                                        //     visibility : { not: 'DRAFT' } // allows access to Variant with visibility: 'PUBLISHED' but NOT 'DRAFT'
                                        // },
                                        select : {
                                            id   : true,
                                            
                                            name : true,
                                        },
                                        orderBy : {
                                            sort : 'asc',
                                        },
                                    },
                                },
                                orderBy : {
                                    sort : 'asc',
                                },
                            },
                        },
                    },
                    variantIds     : true,
                },
            },
            shippingProvider : {
                select : {
                    name            : true, // optional for displaying email report
                    
                    weightStep      : true, // required for calculating `getMatchingShipping()`
                    
                    estimate        : true, // optional for displaying email report
                    shippingRates   : true, // required for calculating `getMatchingShipping()`
                    
                    useSpecificArea : true, // required for calculating `getMatchingShipping()`
                    countries       : true, // required for calculating `getMatchingShipping()`
                },
            },
            customer : {
                select : {
                    name  : true,
                    email : true,
                    customerPreference : {
                        select : {
                            marketingOpt : true,
                        },
                    },
                },
            },
            guest    : {
                select : {
                    name  : true,
                    email : true,
                    guestPreference : {
                        select : {
                            marketingOpt : true,
                        },
                    },
                },
            },
        },
    });
    const shippingAddressData  = newOrder.shippingAddress;
    const shippingProviderData = newOrder.shippingProvider;
    return {
        ...newOrder,
        items: newOrder.items.map((item) => ({
            ...item,
            product : !!item.product ? {
                name          : item.product.name,
                image         : item.product.images?.[0] ?? null,
                imageBase64   : undefined,
                imageId       : undefined,
                
                // relations:
                variantGroups : item.product.variantGroups.map(({variants}) => variants),
            } : null,
        })),
        shippingProvider : (
            (shippingAddressData && shippingProviderData)
            ? getMatchingShipping(shippingProviderData, { city: shippingAddressData.city, zone: shippingAddressData.zone, country: shippingAddressData.country })
            : null
        ),
        customerOrGuest : (
            !!customer
            ? (() => {
                const {customerPreference: preference, ...customerData} = customer;
                return {
                    ...customerData,
                    preference,
                };
            })()
            : (
                !!guest
                ? (() => {
                    const {guestPreference: preference, ...guestData} = guest;
                    return {
                        ...guestData,
                        preference,
                    };
                })()
                : null
            )
        ),
    } satisfies OrderAndData;
}

export interface FindOrderData {
    orderId   ?: string|null
    paymentId ?: string|null
}
export const findOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], findOrderData: FindOrderData): Promise<OrderAndData|null> => {
    // data:
    const {
        orderId   : orderIdRaw,
        paymentId : paymentIdRaw,
    } = findOrderData;
    const orderId   = orderIdRaw   || undefined;
    const paymentId = paymentIdRaw || undefined;
    if (!orderId && !paymentId) return null;
    
    
    const existingOrder = await prismaTransaction.order.findUnique({
        where  : {
            orderId   : orderId,
            // paymentId : paymentId,
        },
        include : {
            items : {
                select : {
                    // data:
                    price          : true,
                    shippingWeight : true,
                    quantity       : true,
                    
                    // relations:
                    product        : {
                        select : {
                            name   : true,
                            images : true,
                            
                            // relations:
                            variantGroups : {
                                select : {
                                    variants : {
                                        // always allow to access DRAFT variants when the customer is already ordered:
                                        // where    : {
                                        //     visibility : { not: 'DRAFT' } // allows access to Variant with visibility: 'PUBLISHED' but NOT 'DRAFT'
                                        // },
                                        select : {
                                            id   : true,
                                            
                                            name : true,
                                        },
                                        orderBy : {
                                            sort : 'asc',
                                        },
                                    },
                                },
                                orderBy : {
                                    sort : 'asc',
                                },
                            },
                        },
                    },
                    variantIds     : true,
                },
            },
            shippingProvider : {
                select : {
                    name            : true, // optional for displaying email report
                    
                    weightStep      : true, // required for calculating `getMatchingShipping()`
                    
                    estimate        : true, // optional for displaying email report
                    shippingRates   : true, // required for calculating `getMatchingShipping()`
                    
                    useSpecificArea : true, // required for calculating `getMatchingShipping()`
                    countries       : true, // required for calculating `getMatchingShipping()`
                },
            },
            customer : {
                select : {
                    name  : true,
                    email : true,
                    customerPreference : {
                        select : {
                            marketingOpt : true,
                        },
                    },
                },
            },
            guest    : {
                select : {
                    name  : true,
                    email : true,
                    guestPreference : {
                        select : {
                            marketingOpt : true,
                        },
                    },
                },
            },
        },
    });
    if (!existingOrder) return null;
    const {customer, guest, ...newOrder} = existingOrder;
    const shippingAddressData  = newOrder.shippingAddress;
    const shippingProviderData = newOrder.shippingProvider;
    return {
        ...newOrder,
        items: newOrder.items.map((item) => ({
            ...item,
            product : !!item.product ? {
                name          : item.product.name,
                image         : item.product.images?.[0] ?? null,
                imageBase64   : undefined,
                imageId       : undefined,
                
                // relations:
                variantGroups : item.product.variantGroups.map(({variants}) => variants),
            } : null,
        })),
        shippingProvider : (
            (shippingAddressData && shippingProviderData)
            ? getMatchingShipping(shippingProviderData, { city: shippingAddressData.city, zone: shippingAddressData.zone, country: shippingAddressData.country })
            : null
        ),
        customerOrGuest : (
            !!customer
            ? (() => {
                const {customerPreference: preference, ...customerData} = customer;
                return {
                    ...customerData,
                    preference,
                };
            })()
            : (
                !!guest
                ? (() => {
                    const {guestPreference: preference, ...guestData} = guest;
                    return {
                        ...guestData,
                        preference,
                    };
                })()
                : null
            )
        ),
    } satisfies OrderAndData;
}



export type CommitDraftOrder = Omit<DraftOrder,
    |'createdAt'
> & {
    items : Omit<DraftOrdersOnProducts,
        |'id'
        
        |'draftOrderId'
    >[]
}
export interface CommitOrderData {
    draftOrder               : CommitDraftOrder
    payment                  : Payment
    paymentConfirmationToken : string|undefined
}
export const commitOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], commitOrderData : CommitOrderData): Promise<OrderAndData> => {
    // data:
    const {
        draftOrder,
        payment,
        paymentConfirmationToken,
    } = commitOrderData;
    
    
    
    const [orderAndData] = await Promise.all([
        createOrder(prismaTransaction, {
            orderId                  : draftOrder.orderId,
            paymentId                : draftOrder.paymentId,
            items                    : draftOrder.items,
            customerId               : draftOrder.customerId,
            guestId                  : draftOrder.guestId,
            preferredCurrency        : draftOrder.preferredCurrency,
            shippingAddress          : draftOrder.shippingAddress,
            shippingCost             : draftOrder.shippingCost,
            shippingProviderId       : draftOrder.shippingProviderId,
            payment                  : payment,
            paymentConfirmationToken : paymentConfirmationToken ?? null,
        }),
        prismaTransaction.draftOrder.delete({
            where  : {
                id : draftOrder.id,
            },
            select : {
                id : true,
            },
        }),
    ]);
    return orderAndData;
}

type RevertDraftOrder = Pick<DraftOrder,
    |'id'
    
    |'orderId'
> & {
    items : Pick<DraftOrdersOnProducts,
        |'productId'
        |'variantIds'
        
        |'quantity'
    >[]
}
export const revertOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], { draftOrder } : { draftOrder: RevertDraftOrder }) => {
    await Promise.all([
        ...(draftOrder.items.map(({productId, variantIds, quantity}) =>
            !productId
            ? undefined
            : prismaTransaction.stock.updateMany({
                where  : {
                    productId  : productId,
                    value      : { not      : null       },
                    variantIds : { hasEvery : variantIds },
                },
                data   : {
                    value : { increment : quantity }
                },
            })
        )),
        prismaTransaction.draftOrder.delete({
            where  : {
                id : draftOrder.id,
            },
            select : {
                id : true,
            },
        }),
    ]);
}



const getCountryList = async (): Promise<EntityState<CountryPreview>> => {
    const allCountries = await prisma.country.findMany({
        select : {
            name    : true,
            
            code    : true,
        },
        // enabled: true
    });
    const countryListAdapter = createEntityAdapter<CountryPreview>({
        selectId : (countryEntry) => countryEntry.code,
    });
    const countryList = countryListAdapter.addMany(
        countryListAdapter.getInitialState(),
        allCountries
    );
    return countryList;
}

export interface SendEmailConfirmationOptions {
    newOrder                 : OrderAndData
    
    isPaid                   : boolean
    paymentConfirmationToken : string|undefined
}
export const sendEmailConfirmation = async (options: SendEmailConfirmationOptions): Promise<boolean> => {
    // options:
    const {
        newOrder,
        
        isPaid,
        paymentConfirmationToken,
    } = options;
    const customerEmail = newOrder.customerOrGuest?.email;
    if (!customerEmail) return false;
    
    
    
    //#region download image url to base64
    const newOrderItems = newOrder.items;
    const imageUrls     = newOrderItems.map((item) => item.product?.image);
    const imageBase64s  = await Promise.all(
        imageUrls.map(async (imageUrl): Promise<string|undefined> => {
            if (!imageUrl) return undefined;
            const resolvedImageUrl = resolveMediaUrl(imageUrl);
            if (!resolvedImageUrl) return undefined;
            try {
                return await downloadImageAsBase64(resolvedImageUrl, 64);
            }
            catch (error: any) { // silently ignore the error and resulting as undefined:
                console.log('ERROR DOWNLOADING IMAGE: ', error);
                return undefined;
            } // if
        })
    );
    console.log('downloaded images: ', imageBase64s);
    imageBase64s.forEach((imageBase64, index) => {
        if (!imageBase64) return;
        const itemProduct = newOrderItems[index].product;
        if (!itemProduct) return;
        itemProduct.imageBase64 = imageBase64;
        itemProduct.imageId     = `i${index}`;
    });
    //#endregion download image url to base64
    
    
    
    try {
        const countryList = await getCountryList();
        
        
        
        const {
            business,
            payment,
            shipping,
            emails : {
                checkout : checkoutEmail,
            },
        } = checkoutConfig;
        
        
        
        const { renderToStaticNodeStream } = await import('react-dom/server');
        const renderToStaticMarkupAsync = async (element: React.ReactElement<any, React.JSXElementConstructor<any>>, options?: ServerOptions): Promise<string> => {
            const readableStream = renderToStaticNodeStream(element, options);
            const chunks : Buffer[] = [];
            return await new Promise<string>((resolve, reject) => {
                readableStream.on('data' , (chunk) => chunks.push(Buffer.from(chunk)));
                readableStream.on('error', (error) => reject(error));
                readableStream.on('end'  , ()      => resolve(Buffer.concat(chunks).toString('utf8')));
            });
        };
        
        
        
        const businessContextProviderProps  : BusinessContextProviderProps = {
            // data:
            model : business,
        };
        const orderDataContextProviderProps : OrderDataContextProviderProps = {
            // data:
            order                : newOrder,
            customerOrGuest      : newOrder.customerOrGuest,
            paymentConfirmation  : {
                token            : paymentConfirmationToken ?? '',
                rejectionReason  : null,
            },
            isPaid               : isPaid,
            shippingTracking     : null,
            
            
            
            // relation data:
            countryList          : countryList,
        };
        const paymentContextProviderProps  : PaymentContextProviderProps = {
            // data:
            model : payment,
        };
        const shippingContextProviderProps  : ShippingContextProviderProps = {
            // data:
            model : shipping,
        };
        
        
        
        const transporter = nodemailer.createTransport({
            host     : checkoutEmail.host,
            port     : checkoutEmail.port,
            secure   : checkoutEmail.secure,
            auth     : {
                user : checkoutEmail.username,
                pass : checkoutEmail.password,
            },
        });
        try {
            console.log('sending email...');
            await transporter.sendMail({
                from        : checkoutEmail.from,
                to          : customerEmail,
                subject     : (await renderToStaticMarkupAsync(
                    <BusinessContextProvider {...businessContextProviderProps}>
                        <OrderDataContextProvider {...orderDataContextProviderProps}>
                            <PaymentContextProvider {...paymentContextProviderProps}>
                                <ShippingContextProvider {...shippingContextProviderProps}>
                                    {checkoutEmail.subject}
                                </ShippingContextProvider>
                            </PaymentContextProvider>
                        </OrderDataContextProvider>
                    </BusinessContextProvider>
                )).replace(/<!--(.|[^.])*?-->/g, '').replace(/[\r\n\t]+/g, ' ').trim(),
                html        : (await renderToStaticMarkupAsync(
                    <BusinessContextProvider {...businessContextProviderProps}>
                        <OrderDataContextProvider {...orderDataContextProviderProps}>
                            <PaymentContextProvider {...paymentContextProviderProps}>
                                <ShippingContextProvider {...shippingContextProviderProps}>
                                    {checkoutEmail.message}
                                </ShippingContextProvider>
                            </PaymentContextProvider>
                        </OrderDataContextProvider>
                    </BusinessContextProvider>
                )).replace(/<!--(.|[^.])*?-->/g, '').trim(),
                attachments : (
                    newOrderItems
                    .filter(({product}) => !!product && !!product.imageBase64 && !!product.imageId)
                    .map(({product}) => ({
                        path : product?.imageBase64,
                        cid  : product?.imageId,
                    }))
                ),
            });
            console.log('email sent.');
            return true;
        }
        finally {
            transporter.close();
        } // try
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // ignore send email error
        return false;
    } // try
}