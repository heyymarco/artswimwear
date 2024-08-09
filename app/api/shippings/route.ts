// models:
import {
    // types:
    type DefaultShippingOriginDetail,
    type ShippingAddressDetail,
    
    
    
    // utilities:
    defaultShippingOriginSelect,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    // types:
    MatchingShipping,
    MatchingAddress,
    
    
    
    // utilities:
    testMatchingShipping,
}                           from '@/libs/shippings/shippings'
import {
    updateShippingProviders,
}                           from '@/libs/shippings/processors/rajaongkir'
import {
    getMatchingShippings,
}                           from '@/libs/shippings/processors/easypost'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';



// routers:
export const POST    = async (req: Request): Promise<Response> => handleResponse(req, true);
export const PATCH   = async (req: Request): Promise<Response> => handleResponse(req, false);
const handleResponse = async (req: Request, includingInternalShippings = true): Promise<Response> => {
    //#region parsing request
    const {
        country,
        state,
        city,
        zip,
        address,
        
        firstName,
        lastName,
        phone,
        
        
        totalProductWeight,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
           !country               || (typeof(country)            !== 'string') || (country.length   < 2) || (country.length   >  3)
        || !state                 || (typeof(state)              !== 'string') || (state.length     < 3) || (state.length     > 50)
        || !city                  || (typeof(city)               !== 'string') || (city.length      < 3) || (city.length      > 50)
        || (!zip && (zip !== '')) || (typeof(zip)                !== 'string') || (zip.length       < 2) || (zip.length       > 11)
        || !address               || (typeof(address)            !== 'string') || (address.length   < 5) || (address.length   > 90)
        
        || !firstName             || (typeof(firstName)          !== 'string') || (firstName.length < 2) || (firstName.length > 30)
        || !lastName              || (typeof(lastName)           !== 'string') || (lastName.length  < 1) || (lastName.length  > 30)
        || !phone                 || (typeof(phone)              !== 'string') || (phone.length     < 5) || (phone.length     > 15)
        
        ||                           (typeof(totalProductWeight) !== 'number') || !isFinite(totalProductWeight)
    ) {
        return Response.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    // get the shipping origin & shippingProviders:
    const shippingOriginAndProvidersPromise = prisma.$transaction([
        prisma.defaultShippingOrigin.findFirst({
            select : defaultShippingOriginSelect,
        }),
        
        prisma.shippingProvider.findMany({
            where  : {
                visibility : { not: 'DRAFT' }, // allows access to ShippingProvider with visibility: 'PUBLISHED' but NOT 'DRAFT'
            },
            select : {
                // records:
                id         : true, // required for identifier
                
                
                
                // data:
                name       : true, // required for identifier
                
                weightStep : true, // required for calculate_shipping_cost algorithm
                eta        : {     // optional for matching_shipping algorithm
                    select : {
                        // data:
                        min : true,
                        max : true,
                    },
                },
                rates      : {     // required for calculate_shipping_cost algorithm
                    select : {
                        // data:
                        start : true,
                        rate  : true,
                    },
                },
                
                useZones   : true, // required for matching_shipping algorithm
            },
        }),
    ]);
    
    const shippingOriginPromise = (async (): Promise<DefaultShippingOriginDetail|null> => {
        try {
            const [shippingOrigin] = await shippingOriginAndProvidersPromise;
            return shippingOrigin;
        }
        catch {
            return null;
        } // try
    })();
    
    const shippingProvidersPromise = (async (): Promise<Awaited<typeof shippingOriginAndProvidersPromise>[1] | null> => {
        try {
            const [, shippingProviders] = await shippingOriginAndProvidersPromise;
            return shippingProviders;
        }
        catch {
            return null;
        } // try
    })();
    
    
    
    // easypost's shipping rates:
    const externalShippingRatesPromise = (async (): Promise<MatchingShipping[]> => {
        const [shippingOrigin, shippingProviders] = await Promise.all([
            shippingOriginPromise,
            shippingProvidersPromise,
        ]);
        if (!shippingOrigin || !shippingProviders?.length) return [];
        
        
        
        return getMatchingShippings(shippingProviders, {
            origin      : shippingOrigin,
            destination : {
                country,
                state,
                city,
                zip,
                address,
                
                firstName,
                lastName,
                phone,
            },
            totalProductWeight,
            prisma,
        });
    })();
    
    const rajaongkirUpdatedPromise = (async (): Promise<boolean> => {
        if (!includingInternalShippings) return false;
        if (!process.env.RAJAONGKIR_SECRET) return false;
        const shippingOrigin = await shippingOriginPromise;
        if (!shippingOrigin) return false;
        
        
        
        return Promise.race([
            // auto update up to 10 seconds:
            (async (): Promise<boolean> => {
                try {
                    await prisma.$transaction(async (prismaTransaction) => {
                        await updateShippingProviders(prismaTransaction, shippingOrigin, {
                            country,
                            state,
                            city,
                        });
                    }, { timeout: 10000 }); // give a longer timeout for `updateShippingProviders()`
                    
                    
                    
                    return true;
                }
                catch (error: unknown) {
                    console.log('autoUpdate shipping error: ', error);
                    // ignore any error
                    
                    
                    
                    return false;
                } // try
            })(),
            
            // ignore the auto update above if runs longer than 5 secs:
            new Promise<false>((resolve) => {
                setTimeout(() => {
                    resolve(false);
                }, 5000);
            }),
        ]);
    });
    
    const internalShippingRatesPromise = (async (): Promise<MatchingShipping[]> => {
        if (!includingInternalShippings) return [];
        
        
        
        await rajaongkirUpdatedPromise;
        
        
        
        // populate:
        const shippings = await shippingProvidersPromise;
        if (!shippings?.length) return [];
        
        
        
        // filter out non_compatible shippings:
        const shippingAddress : ShippingAddressDetail = {
            country,
            state,
            city,
            zip,
            address,
            
            firstName,
            lastName,
            phone,
        };
        const matchingShippings : MatchingShipping[] = (
            (await prisma.$transaction(async (prismaTransaction) => {
                return await Promise.all( // await for all promises completed before closing the transaction
                    shippings
                    .map((shippingProvider) => testMatchingShipping(prismaTransaction, shippingProvider, shippingAddress))
                );
            }, { timeout: 15000 })) // give a longer timeout for `testMatchingShipping`
            .filter((shippingProvider): shippingProvider is Exclude<typeof shippingProvider, null|undefined> => !!shippingProvider)
        );
        return matchingShippings;
    })();
    
    const [externalShippingRates, internalShippingRates] = await Promise.all([
        // easypost's shipping rates:
        externalShippingRatesPromise,
        
        
        
        // internal's shipping rates:
        internalShippingRatesPromise,
    ]);
    
    
    
    return Response.json([
        ...internalShippingRates,
        ...externalShippingRates,
    ]); // handled with success
}
