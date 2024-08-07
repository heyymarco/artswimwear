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
    ['FedExDefault', 'FedEx'],
]);
const friendlyNameShipping = new Map<string, string>([
    // USPS:
    
    // generals:
    ['USPS GroundAdvantage'       , 'USPS Ground'],
    ['USPS Priority Mail'         , 'USPS Priority'],
    ['USPS Priority Mail Express' , 'USPS Express'],
    
    
    
    // FedEx:
    
    // generals:
    ['FedEx FEDEX_GROUND'        , 'FedEx Ground'],
    
    // overnight delivery:
    ['FedEx FIRST_OVERNIGHT'     , 'FedEx First Overnight'],
    ['FedEx PRIORITY_OVERNIGHT'  , 'FedEx Priority Overnight'],
    ['FedEx STANDARD_OVERNIGHT'  , 'FedEx Standard Overnight'],
    
    // 2 day delivery:
    ['FedEx FEDEX_2_DAY'         , 'FedEx 2Day'],
    ['FedEx FEDEX_2_DAY_AM'      , 'FedEx 2Day AM'],
    
    // 3 day delivery:
    ['FedEx FEDEX_EXPRESS_SAVER' , 'FedEx Express Saver'],
]);



export interface GetAllRatesOptions {
    origin              : DefaultShippingOriginDetail,
    destination         : ShippingAddressDetail
    totalProductWeight  : number
    
    prisma             ?: typeof prisma
}
export const getAllRates = async (shippingProviders: Pick<ShippingProvider, 'id'|'name'>[], options: GetAllRatesOptions): Promise<MatchingShipping[]> => {
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
    
    
    
    // normalize some origin & destination properties to produce shareable cache's key:
    origin.country        = 'US';
    origin.state          = 'California';
    origin.city           = 'San Francisco';
    origin.zip            = '94104';
    
    destination.country   = 'US';
    destination.state     = 'California';
    destination.city      = 'Redondo Beach';
    destination.zip       = '90277';
    destination.address   = '179 N Harbor Dr';
    
    destination.firstName = 'Steve Brule';
    destination.lastName  = 'Brule';
    destination.phone     = '4155559999';
    
    
    
    const originCountry          = origin.country.toUpperCase();
    const originCountryCode      = (
        (originCountry.length === 2)
        ? originCountry
        : ((): string|undefined => {
            const originCountryLowercase = origin.country.toLowerCase();
            return Country.getAllCountries().find(({name}) => (name.toLowerCase() === originCountryLowercase))?.isoCode;
        })()
    );
    const originState            = origin.state;
    const originStateCode        = (
        !originCountryCode
        ? undefined
        : ((): string|undefined => {
            const originStateLowercase = origin.state.toLowerCase();
            return State.getStatesOfCountry(originCountryCode).find(({name}) => (name.toLowerCase() === originStateLowercase))?.isoCode;
        })()
    );
    const originCity             = origin.city;
    const originCityCode         = (
        (!originCountryCode || !originStateCode)
        ? undefined
        : ((): string|undefined => {
            const originCityLowercase = origin.city.toLowerCase();
            return City.getCitiesOfState(originCountryCode, originStateCode).find(({name}) => (name.toLowerCase() === originCityLowercase))?.name
        })()
    );
    const originZip              = origin.zip?.toUpperCase();
    
    const destinationCountry     = destination.country.toUpperCase();
    const destinationCountryCode = (
        (destinationCountry.length === 2)
        ? destinationCountry
        : ((): string|undefined => {
            const destinationCountryLowercase = destination.country.toLowerCase();
            return Country.getAllCountries().find(({name}) => (name.toLowerCase() === destinationCountryLowercase))?.isoCode;
        })()
    );
    const destinationState       = destination.state;
    const destinationStateCode   = (
        !destinationCountryCode
        ? undefined
        : ((): string|undefined => {
            const destinationStateLowercase = destination.state.toLowerCase();
            return State.getStatesOfCountry(destinationCountryCode).find(({name}) => (name.toLowerCase() === destinationStateLowercase))?.isoCode;
        })()
    );
    const destinationCity        = destination.city;
    const destinationCityCode    = (
        (!destinationCountryCode || !destinationStateCode)
        ? undefined
        : ((): string|undefined => {
            const destinationCityLowercase = destination.city.toLowerCase();
            return City.getCitiesOfState(destinationCountryCode, destinationStateCode).find(({name}) => (name.toLowerCase() === destinationCityLowercase))?.name
        })()
    );
    const destinationZip         = destination.zip?.toUpperCase();
    
    const cacheKey               = `${originCountryCode ?? originCountry}::${originStateCode ?? originState}::${originCityCode ?? originCity}::${originZip}::${destinationCountryCode ?? destinationCountry}::${destinationStateCode ?? destinationState}::${destinationCityCode ?? destinationCity}::${destinationZip}::${totalProductWeightInOzStepped}`.toLowerCase();
    
    
    
    if (prisma) {
        try {
            const cached = await prisma.easypostRateCache.findUnique({
                where  : {
                    key : cacheKey,
                    updatedAt : { gt: new Date(Date.now() - (3 * 30 * 24 * 60 * 60 * 1000)) } // prevents for searching cache older than 3 months ago
                },
                select : {
                    items : {
                        select : {
                            eta              : {
                                select : {
                                    min      : true,
                                    max      : true,
                                },
                            },
                            rate             : true,
                            currency         : true,
                            shippingProvider : {
                                select : {
                                    id       : true,
                                    name     : true,
                                },
                            },
                        },
                    },
                },
            });
            
            if (cached) {
                const matchingShippings : MatchingShipping[] = (
                    (await Promise.all(
                        cached.items
                        .map(async ({eta, rate: amount, currency, shippingProvider}) => ({
                            id         : shippingProvider.id,
                            name       : shippingProvider.name,
                            
                            weightStep : 0,
                            eta        : eta,
                            rates      : await convertForeignToSystemCurrencyIfRequired(amount, currency),
                        } satisfies MatchingShipping))
                    ))
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
            zip       : originZip,
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
            zip       : destinationZip,
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
    interface MatchingShippingWithExtra extends MatchingShipping {
        rate     : number,
        currency : string,
    }
    const matchingShippingWithExtras : MatchingShippingWithExtra[] = (
        (await Promise.all(
            rates
            .map(async (rate): Promise<MatchingShippingWithExtra|undefined> => {
                const carrierNameRaw   = rate.carrier;
                const carrierName      = friendlyNameCarriers.get(carrierNameRaw) ?? carrierNameRaw;
                const shippingNameRaw  = `${carrierName} ${rate.service}`;
                const shippingName     = friendlyNameShipping.get(shippingNameRaw) ?? shippingNameRaw;
                console.log(shippingName);
                
                const shippingProvider = shippingProviders.find(({name}) => name.toLowerCase() === shippingName.toLocaleLowerCase());
                if (!shippingProvider) return undefined;
                
                
                
                const amountRaw = rate.rate;
                if (!amountRaw) return undefined;
                const amount = Number.parseFloat(amountRaw);
                if (!isFinite(amount)) return undefined;
                
                
                
                return {
                    id         : shippingProvider.id,
                    name       : shippingProvider.name,
                    
                    weightStep : 0,
                    eta        : (rate.delivery_days <= 0) ? undefined : {
                        min    : rate.delivery_days,
                        max    : rate.delivery_days,
                    },
                    rates      : await convertForeignToSystemCurrencyIfRequired(amount, rate.currency),
                    
                    // extra:
                    rate       : amount,
                    currency   : rate.currency,
                } satisfies MatchingShippingWithExtra;
            })
        ))
        .filter((rate): rate is Exclude<typeof rate, undefined> => (rate !== undefined))
    );
    
    
    
    if (prisma && matchingShippingWithExtras.length) {
        try {
            const items = (
                matchingShippingWithExtras
                .map(({id, eta, rate, currency}) => ({
                    eta                : !eta ? undefined : {
                        create :  {
                            min        : eta.min,
                            max        : eta.max,
                        },
                    },
                    rate               : rate,
                    currency           : currency,
                    shippingProviderId : id,
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
                        // append: if the id(s) are NOT in items => preserve, otherwise delete them, then we create all items
                        deleteMany : {
                            id : { in : items.map(({shippingProviderId}) => shippingProviderId) },
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
        .map(({rate: _rate, currency: _currency, ...matchingShipping}) =>
            matchingShipping
        )
    );
    console.log('cache miss: ', JSON.stringify(matchingShippings, undefined, 3));
    return matchingShippings;
}