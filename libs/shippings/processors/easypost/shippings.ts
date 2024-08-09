// models:
import {
    // types:
    type Prisma,
    type ShippingProvider,
    type DefaultShippingOriginDetail,
    type ShippingAddressDetail,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    // types:
    MatchingShipping,
}                           from '@/libs/shippings/shippings'
import {
    convertForeignToSystemCurrencyIfRequired,
}                           from '@/libs/currencyExchanges'

// easypost:
import {
    getEasyPostInstance,
}                           from './instance'

// others:
import {
    Country,
    State,
    City,
}                           from 'country-state-city'



// utilities:
const friendlyNameCarriers = new Map<string, string>([
    ['USPS'        , 'USPS'],
    ['FedExDefault', 'FedEx'],
    ['DHL'         , 'DHL'],
    ['DHLExpress'  , 'DHL'],
    ['CanadaPost'  , 'Canada Post'],
]);
const friendlyNameShipping = new Map<string, string>([
    // USPS:
    
    // US:
    ['USPS First'                                , 'USPS First'],
    ['USPS Priority'                             , 'USPS Priority'],
    ['USPS Express'                              , 'USPS Express'],
    
    ['USPS GroundAdvantage'                      , 'USPS Ground Advantage'],
    ['USPS LibraryMail'                          , 'USPS Library Mail'],
    ['USPS MediaMail'                            , 'USPS Media Mail'],
    
    // International:
    ['USPS FirstClassMailInternational'          , 'USPS First Class Mail International'],
    ['USPS FirstClassPackageInternationalService', 'USPS First Class Package International Service'],
    ['USPS PriorityMailInternational'            , 'USPS Priority Mail International'],
    ['USPS ExpressMailInternational'             , 'USPS Express Mail International'],
    
    
    
    // FedEx:
    
    // US:
    ['FedEx FEDEX_2_DAY'                      , 'FedEx 2 Day'],
    ['FedEx FEDEX_2_DAY_AM'                   , 'FedEx 2 Day AM'],
    ['FedEx FEDEX_EXPRESS_SAVER'              , 'FedEx Express Saver'],
    ['FedEx FEDEX_GROUND'                     , 'FedEx Ground'],
    ['FedEx FEDEX_FIRST_OVERNIGHT'            , 'FedEx First Overnight'],
    ['FedEx FEDEX_GROUND_HOME_DELIVERY'       , 'FedEx Ground Home Delivery'],
    ['FedEx FEDEX_PRIORITY_OVERNIGHT'         , 'FedEx Priority Overnight'],
    ['FedEx FEDEX_SMART_POST'                 , 'FedEx Smart Post'],
    ['FedEx FEDEX_STANDARD_OVERNIGHT'         , 'FedEx Standard Overnight'],
    // Aliases:
    ['FedEx 2_DAY'                            , 'FedEx 2 Day'],
    ['FedEx 2_DAY_AM'                         , 'FedEx 2 Day AM'],
    ['FedEx EXPRESS_SAVER'                    , 'FedEx Express Saver'],
    ['FedEx GROUND'                           , 'FedEx Ground'],
    ['FedEx FIRST_OVERNIGHT'                  , 'FedEx First Overnight'],
    ['FedEx GROUND_HOME_DELIVERY'             , 'FedEx Ground Home Delivery'],
    ['FedEx PRIORITY_OVERNIGHT'               , 'FedEx Priority Overnight'],
    ['FedEx SMART_POST'                       , 'FedEx Smart Post'],
    ['FedEx STANDARD_OVERNIGHT'               , 'FedEx Standard Overnight'],
    
    // International:
    ['FedEx FEDEX_INTERNATIONAL_CONNECT_PLUS' , 'FedEx International Connect Plus'],
    ['FedEx FEDEX_INTERNATIONAL_ECONOMY'      , 'FedEx International Economy'],
    ['FedEx FEDEX_INTERNATIONAL_FIRST'        , 'FedEx International First'],
    ['FedEx FEDEX_INTERNATIONAL_PRIORITY'     , 'FedEx International Priority'],
    // Aliases:
    ['FedEx INTERNATIONAL_CONNECT_PLUS'       , 'FedEx International Connect Plus'],
    ['FedEx INTERNATIONAL_ECONOMY'            , 'FedEx International Economy'],
    ['FedEx INTERNATIONAL_FIRST'              , 'FedEx International First'],
    ['FedEx INTERNATIONAL_PRIORITY'           , 'FedEx International Priority'],
    
    
    
    // DHL Express:
    ['DHL BreakBulkEconomy'             ,'DHL Break Bulk Economy'],
    ['DHL BreakBulkExpress'             ,'DHL Break Bulk Express'],
    ['DHL DomesticEconomySelect'        ,'DHL Domestic Economy Select'],
    ['DHL DomesticExpress'              ,'DHL Domestic Express'],
    ['DHL DomesticExpress1030'          ,'DHL Domestic Express 1030'],
    ['DHL DomesticExpress1200'          ,'DHL Domestic Express 1200'],
    ['DHL EconomySelect'                ,'DHL Economy Select'],
    ['DHL EconomySelectNonDoc'          ,'DHL Economy Select Non Doc'],
    ['DHL EuroPack'                     ,'DHL Europack'],
    ['DHL EuropackNonDoc'               ,'DHL Europack Non Doc'],
    ['DHL Express1030'                  ,'DHL Express 1030'],
    ['DHL Express1030NonDoc'            ,'DHL Express 1030 Non Doc'],
    ['DHL Express1200NonDoc'            ,'DHL Express 1200 Non Doc'],
    ['DHL Express1200'                  ,'DHL Express 1200'],
    ['DHL Express900'                   ,'DHL Express 900'],
    ['DHL Express900NonDoc'             ,'DHL Express 900 Non Doc'],
    ['DHL ExpressEasy'                  ,'DHL Express Easy'],
    ['DHL ExpressEasyNonDoc'            ,'DHL Express Easy Non Doc'],
    ['DHL ExpressEnvelope'              ,'DHL Express Envelope'],
    ['DHL ExpressWorldwide'             ,'DHL Express Worldwide'],
    ['DHL ExpressWorldwideB2C'          ,'DHL Express Worldwide B2C'],
    ['DHL ExpressWorldwideB2CNonDoc'    ,'DHL Express Worldwide B2C Non Doc'],
    ['DHL ExpressWorldwideECX'          ,'DHL Express Worldwide ECX'],
    ['DHL ExpressWorldwideNonDoc'       ,'DHL Express Worldwide Non Doc'],
    ['DHL FreightWorldwide'             ,'DHL Freight Worldwide'],
    ['DHL GlobalmailBusiness'           ,'DHL Global Mail Business'],
    ['DHL JetLine'                      ,'DHL Jet Line'],
    ['DHL JumboBox'                     ,'DHL Jumbo Box'],
    ['DHL LogisticsServices'            ,'DHL Logistics Services'],
    ['DHL SameDay'                      ,'DHL Same Day'],
    ['DHL SecureLine'                   ,'DHL Secure Line'],
    ['DHL SprintLine'                   ,'DHL Sprint Line'],
    
    
    
    // Canada Post:
    
    // Canada:
    ['Canada Post RegularParcel'                    , 'Canada Post Regular Parcel'],
    ['Canada Post ExpeditedParcel'                  , 'Canada Post Expedited Parcel'],
    ['Canada Post Xpresspost'                       , 'Canada Post Xpresspost'],
    ['Canada Post Priority'                         , 'Canada Post Priority'],
    
    // US:
    ['Canada Post ExpeditedParcelUSA'               , 'Canada Post Expedited Parcel USA'],
    ['Canada Post SmallPacketUSAAir'                , 'Canada Post Small Packet USA Air'],
    ['Canada Post TrackedPacketUSA'                 , 'Canada Post Tracked Packet USA'],
    ['Canada Post TrackedPacketUSALVM'              , 'Canada Post Tracked Packet USA LVM'],
    ['Canada Post XpresspostUSA'                    , 'Canada Post Xpresspost USA'],
    
    // International:
    ['Canada Post XpresspostInternational'          , 'Canada Post Xpresspost International'],
    ['Canada Post InternationalParcelAir'           , 'Canada Post International Parcel Air'],
    ['Canada Post InternationalParcelSurface'       , 'Canada Post International Parcel Surface'],
    ['Canada Post SmallPacketInternationalAir'      , 'Canada Post Small Packet International Air'],
    ['Canada Post SmallPacketInternationalSurface'  , 'Canada Post Small Packet International Surface'],
    ['Canada Post TrackedPacketInternational'       , 'Canada Post Tracked Packet International'],
    ['Canada Post ExpeditedParcelPlus'              , 'Canada Post Expedited Parcel Plus'],
]);



export interface GetMatchingShippingsOptions {
    origin              : DefaultShippingOriginDetail,
    destination         : ShippingAddressDetail
    totalProductWeight  : number
    
    prisma             ?: typeof prisma
}
export const getMatchingShippings = async (shippingProviders: Pick<ShippingProvider, 'id'|'name'>[], options: GetMatchingShippingsOptions): Promise<MatchingShipping[]> => {
    // options:
    const {
        origin,
        destination,
        totalProductWeight: totalProductWeightInKg,
        
        prisma,
    } = options;
    const totalProductWeightInKgStepped = (
        Math.round(totalProductWeightInKg / 0.25)
        * 0.25
    );
    const totalProductWeightInOzInteger = Math.max(1, // min 1 oz
        Math.round( // round to nearest integer of oz
            totalProductWeightInKgStepped * 35.274 // converts kg to oz
        )
    );
    const totalProductWeightInOzStepped = (
        (totalProductWeightInOzInteger < 16)
        ? totalProductWeightInOzInteger
        : (
            Math.ceil(totalProductWeightInOzInteger / 16)
            *
            16
        )
    );
    
    
    
    // test:
    // origin.country        = 'US';
    // origin.state          = 'California';
    // origin.city           = 'San Francisco';
    // origin.zip            = '94104';
    // 
    // destination.country   = 'US';
    // destination.state     = 'California';
    // destination.city      = 'Redondo Beach';
    // destination.zip       = '90277';
    // destination.address   = '179 N Harbor Dr';
    // 
    // destination.firstName = 'Steve Brule';
    // destination.lastName  = 'Brule';
    // destination.phone     = '4155559999';
    
    
    
    // normalize some origin & destination properties to produce shareable cache's key:
    
    const originCountry          = origin.country.trim();
    const originCountryCode      = (
        (originCountry.length === 2)
        ? originCountry.toUpperCase()
        : ((): string|undefined => {
            const originCountryLowercase = originCountry.toLowerCase();
            return Country.getAllCountries().find(({name}) => (name.toLowerCase() === originCountryLowercase))?.isoCode;
        })()
    );
    const originState            = origin.state.trim();
    const originStateCode        = (
        !originCountryCode
        ? undefined
        : ((): string|undefined => {
            const originStateLowercase = originState.toLowerCase();
            return State.getStatesOfCountry(originCountryCode).find(({name}) => (name.toLowerCase() === originStateLowercase))?.isoCode;
        })()
    );
    const originCity             = origin.city.trim();
    const originCityCode         = (
        (!originCountryCode || !originStateCode)
        ? undefined
        : ((): string|undefined => {
            const originCityLowercase = originCity.toLowerCase();
            return City.getCitiesOfState(originCountryCode, originStateCode).find(({name}) => (name.toLowerCase() === originCityLowercase))?.name
        })()
    );
    const originZip              = origin.zip?.trim().toUpperCase();
    
    const destinationCountry     = destination.country.trim();
    const destinationCountryCode = (
        (destinationCountry.length === 2)
        ? destinationCountry.toUpperCase()
        : ((): string|undefined => {
            const destinationCountryLowercase = destinationCountry.toLowerCase();
            return Country.getAllCountries().find(({name}) => (name.toLowerCase() === destinationCountryLowercase))?.isoCode;
        })()
    );
    const destinationState       = destination.state.trim();
    const destinationStateCode   = (
        !destinationCountryCode
        ? undefined
        : ((): string|undefined => {
            const destinationStateLowercase = destinationState.toLowerCase();
            return State.getStatesOfCountry(destinationCountryCode).find(({name}) => (name.toLowerCase() === destinationStateLowercase))?.isoCode;
        })()
    );
    const destinationCity        = destination.city.trim();
    const destinationCityCode    = (
        (!destinationCountryCode || !destinationStateCode)
        ? undefined
        : ((): string|undefined => {
            const destinationCityLowercase = destinationCity.toLowerCase();
            return City.getCitiesOfState(destinationCountryCode, destinationStateCode).find(({name}) => (name.toLowerCase() === destinationCityLowercase))?.name
        })()
    );
    const destinationZip         = destination.zip?.trim().toUpperCase();
    
    const cacheKey               = `${originCountryCode ?? originCountry}::${originStateCode ?? originState}::${originCityCode ?? originCity}::${originZip}::${destinationCountryCode ?? destinationCountry}::${destinationStateCode ?? destinationState}::${destinationCityCode ?? destinationCity}::${destinationZip}::${totalProductWeightInOzStepped}`.toLowerCase();
    
    
    
    if (prisma) {
        try {
            const [, cached] = await prisma.$transaction([
                prisma.easypostRateCache.deleteMany({
                    where  : {
                        updatedAt : { lt: new Date(Date.now() - (3 * 30 * 24 * 60 * 60 * 1000)) } // delete caches older than 3 months ago
                    },
                }),
                prisma.easypostRateCache.findUnique({
                    where  : {
                        key : cacheKey,
                    },
                    select : {
                        items : {
                            select : {
                                carrier     : true,
                                service     : true,
                                
                                eta         : {
                                    select : {
                                        min : true,
                                        max : true,
                                    },
                                },
                                rate        : true,
                                currency    : true,
                            },
                        },
                    },
                }),
            ]);
            
            if (cached) {
                const matchingShippings : MatchingShipping[] = (
                    (await Promise.all(
                        cached.items
                        .map(async ({carrier, service, eta, rate: amount, currency}) => {
                            const carrierNameRaw   = carrier;
                            const carrierName      = friendlyNameCarriers.get(carrierNameRaw) ?? carrierNameRaw;
                            const serviceNameRaw   = service;
                            const combinedNameRaw  = `${carrierName} ${serviceNameRaw}`;
                            const combinedName     = friendlyNameShipping.get(combinedNameRaw) ?? combinedNameRaw;
                            console.log(combinedName);
                            
                            const shippingProvider = shippingProviders.find(({name}) => name.toLowerCase() === combinedName.toLocaleLowerCase());
                            if (!shippingProvider) return undefined;
                            
                            
                            
                            return {
                                id         : shippingProvider.id,
                                name       : shippingProvider.name,
                                
                                weightStep : 0,
                                eta        : eta,
                                rates      : await convertForeignToSystemCurrencyIfRequired(amount, currency),
                            } satisfies MatchingShipping;
                        })
                    ))
                    .filter((matchingShipping): matchingShipping is Exclude<typeof matchingShipping, undefined> => (matchingShipping !== undefined))
                    .toSorted((a, b) => (!a.name || !b.name) ? 0 : (a.name < b.name) ? -1 : 1)
                );
                console.log('cache hit: ', JSON.stringify(matchingShippings, undefined, 3));
                return matchingShippings;
            } // if
        }
        catch (error: any) {
            console.log('retrieve EasypostRateCache error: ', error);
            // ignore any error
        } // try
    } // if
    
    
    
    const easyPost = getEasyPostInstance();
    if (!easyPost) return [];
    
    
    
    const shipment = await easyPost.Shipment.create({
        from_address: {
            country   : originCountryCode ?? originCountry,
            state     : originStateCode ?? originState,
            city      : originCityCode ?? originCity,
            zip       : originZip || undefined, // maybe optional (empty string => undefined)
            street1   : origin.address,
            
            company   : origin.company   || undefined, // maybe optional (empty string => undefined)
            firstName : origin.firstName || undefined, // maybe optional (empty string => undefined)
            lastName  : origin.lastName  || undefined, // maybe optional (empty string => undefined)
            phone     : origin.phone     || undefined, // maybe optional (empty string => undefined)
        },
        to_address: {
            country   : destinationCountryCode ?? destinationCountry,
            state     : destinationStateCode ?? destinationState,
            city      : destinationCityCode ?? destinationCity,
            zip       : destinationZip || undefined, // maybe optional (empty string => undefined)
            street1   : destination.address,
            
            firstName : destination.firstName,
            lastName  : destination.lastName,
            phone     : destination.phone,
        },
        parcel: {
            weight: totalProductWeightInOzStepped,
        },
        // carrier_accounts : [
        //     // 'ca_dfa4ef16f792459684684fe4adb9d15a', // USPS: GroundAdvantage, Express, Priority
        //     // 'ca_204ed43d30614919b933bb446d92cf02', // FedExDefault: FEDEX_GROUND, FEDEX_EXPRESS_SAVER, FEDEX_2_DAY, FEDEX_2_DAY_AM, SMART_POST, PRIORITY_OVERNIGHT, STANDARD_OVERNIGHT
        // ],
    });
    const rates = shipment.rates;
    interface MatchingShippingWithExtra
        extends
            Omit<MatchingShipping, 'id'|'name'>,
            Partial<Pick<MatchingShipping, 'id'|'name'>>
    {
        // extra:
        carrier  : string
        service  : string
        rate     : number
        currency : string
    }
    const matchingShippingWithExtras : MatchingShippingWithExtra[] = (
        (await Promise.all(
            rates
            .map(async (rate): Promise<MatchingShippingWithExtra|undefined> => {
                const carrierNameRaw   = rate.carrier;
                const carrierName      = friendlyNameCarriers.get(carrierNameRaw) ?? carrierNameRaw;
                const serviceNameRaw   = rate.service;
                const combinedNameRaw  = `${carrierName} ${serviceNameRaw}`;
                const combinedName     = friendlyNameShipping.get(combinedNameRaw) ?? combinedNameRaw;
                console.log(combinedName);
                
                const shippingProvider = shippingProviders.find(({name}) => name.toLowerCase() === combinedName.toLocaleLowerCase());
                
                
                
                const amountRaw = rate.rate;
                if (!amountRaw) return undefined; // invalid data
                const amount = Number.parseFloat(amountRaw);
                if (!isFinite(amount)) return undefined; // invalid data
                
                
                
                return {
                    id         : shippingProvider?.id,
                    name       : shippingProvider?.name,
                    
                    weightStep : 0,
                    eta        : ((typeof(rate.delivery_days) !== 'number') || (rate.delivery_days <= 0)) ? undefined : {
                        min    : rate.delivery_days,
                        max    : rate.delivery_days,
                    },
                    rates      : await convertForeignToSystemCurrencyIfRequired(amount, rate.currency),
                    
                    // extra:
                    carrier    : carrierNameRaw,
                    service    : serviceNameRaw,
                    rate       : amount,
                    currency   : rate.currency,
                } satisfies MatchingShippingWithExtra;
            })
        ))
        .filter((rate): rate is Exclude<typeof rate, undefined> => (rate !== undefined))
        .toSorted((a, b) => (!a.name || !b.name) ? 0 : (a.name < b.name) ? -1 : 1)
    );
    
    
    
    if (prisma) {
        try {
            const items = (
                matchingShippingWithExtras
                .map(({eta, carrier, service, rate, currency}) => ({
                    eta                : !eta ? undefined : {
                        create :  {
                            min        : eta.min,
                            max        : eta.max,
                        },
                    },
                    
                    // extra:
                    carrier            : carrier,
                    service            : service,
                    rate               : rate,
                    currency           : currency,
                }))
            ) satisfies Prisma.EasypostRateCacheItemUpdateInput[];
            
            await prisma.easypostRateCache.upsert({
                where  : {
                    key : cacheKey,
                },
                create : {
                    key : cacheKey,
                    items : {
                        create : items,
                    },
                },
                update : {
                    items : {
                        // append: if the (carrier+service)(s) are NOT in items => preserve, otherwise delete them, then we create all items
                        deleteMany : {
                            OR : items.map(({carrier, service}) => ({
                                carrier : { equals : carrier, mode: 'insensitive' },
                                service : { equals : service, mode: 'insensitive' },
                            })),
                        },
                        create : items,
                    },
                },
                select : {
                    id : true,
                },
            });
        }
        catch (error: any) {
            console.log('update EasypostRateCache error: ', error);
            // ignore any error
        } // try
    } // if
    
    
    
    const matchingShippings : MatchingShipping[] = (
        matchingShippingWithExtras
        .filter((matchingShippingWithExtra): matchingShippingWithExtra is (MatchingShippingWithExtra & MatchingShipping) => (matchingShippingWithExtra.id !== undefined) && (matchingShippingWithExtra.name !== undefined))
        .map(({carrier: _carrier, service: _service, rate: _rate, currency: _currency, ...matchingShipping}) =>
            matchingShipping
        )
    );
    console.log('cache miss: ', JSON.stringify(matchingShippings, undefined, 3));
    return matchingShippings;
}