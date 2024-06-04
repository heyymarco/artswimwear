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

// models:
import {
    type SendEmailData,
}                           from '@/models'

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

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    downloadImageAsBase64,
}                           from '@/libs/images'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



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
    paymentConfirmationToken : string|null
}
export const sendConfirmationEmail = async (options: SendEmailConfirmationOptions): Promise<boolean|null> => {
    // options:
    const {
        newOrder,
        
        isPaid,
        paymentConfirmationToken,
    } = options;
    const customerEmail = newOrder.customerOrGuest?.email;
    if (!customerEmail) return null;
    
    
    
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
            customerEmails : {
                checkout : checkoutEmail,
            },
        } = checkoutConfigServer;
        
        
        
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
        
        
        
        await fetch(`${process.env.APP_URL ?? ''}/api/send-email`, {
            method  : 'POST',
            headers : {
                'X-Secret' : process.env.APP_SECRET ?? '',
            },
            body    : JSON.stringify({
                host        : checkoutEmail.host,
                port        : checkoutEmail.port,
                secure      : checkoutEmail.secure,
                user        : checkoutEmail.username,
                pass        : checkoutEmail.password,
                
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
            } satisfies SendEmailData),
        });
        
        
        
        return true; // succeeded
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // ignore send email error
        
        
        
        return false; // failed
    } // try
}