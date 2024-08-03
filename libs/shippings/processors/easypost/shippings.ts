// models:
import {
    // types:
    type Prisma,
    type DefaultShippingOriginDetail,
    type ShippingEta,
    type ShippingRate,
    
    
    
    // utilities:
    selectWithSort,
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
    getMatchingShipping,
}                           from '@/libs/shippings/shippings'

// easypost:
import {
    getEasyPostInstance,
}                           from './instance'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



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



export const getAllRates = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], origin: DefaultShippingOriginDetail|null|undefined): Promise<MatchingShipping[]> => {
    const easyPost = getEasyPostInstance();
    if (!easyPost || !origin) return [];
    
    
    
    const [shipment, shippingProviders] = await Promise.all([
        easyPost.Shipment.create({
        from_address: {
            country   : origin.country.toUpperCase(),
            state     : origin.state,
            city      : origin.city,
            zip       : origin.zip,
            street1   : origin.address,
            
            company   : origin.company   || undefined,
            firstName : origin.firstName || undefined,
            lastName  : origin.lastName  || undefined,
            phone     : origin.phone     || undefined,
        },
        to_address: {
            country   : 'US',
            state     : 'California',
            city      : 'Redondo Beach',
            zip       : '90277',
            // street1   : '179 N Harbor Dr',
            
            // name      : 'Dr. Steve Brule',
            // phone     : '4155559999',
        },
        parcel: {
            weight: Math.max(16, 0.16),
        },
        // carrier_accounts : [
        //     // 'ca_dfa4ef16f792459684684fe4adb9d15a', // USPS: GroundAdvantage, Express, Priority
        //     // 'ca_204ed43d30614919b933bb446d92cf02', // FedExDefault: FEDEX_GROUND, FEDEX_EXPRESS_SAVER, FEDEX_2_DAY, FEDEX_2_DAY_AM, SMART_POST, PRIORITY_OVERNIGHT, STANDARD_OVERNIGHT
        // ],
        }),
        prismaTransaction.shippingProvider.findMany({
            where  : {
                // no condition needed
            },
            select : {
                id         : true, // required for identifier
                name       : true, // required for identifier
            },
        }),
    ]);
    const rates = shipment.rates;
    const matchingShipping : MatchingShipping[] = (
        rates
        .map((rate) => {
            const carrierNameRaw   = rate.carrier;
            const carrierName      = friendlyNameCarriers.get(carrierNameRaw) ?? carrierNameRaw;
            const shippingNameRaw  = `${carrierName} ${rate.service}`;
            const shippingName     = friendlyNameShipping.get(shippingNameRaw) ?? shippingNameRaw;
            console.log(shippingName);
            
            const shippingProvider = shippingProviders.find(({name}) => name.toLowerCase() === shippingName.toLocaleLowerCase());
            if (!shippingProvider) return undefined;
            
            
            
            return {
                id         : shippingProvider.id,
                name       : shippingProvider.name,
                
                weightStep : 0,
                rates      : [],
            } satisfies MatchingShipping;
        })
        .filter((rate): rate is Exclude<typeof rate, undefined> => (rate !== undefined))
    )
    console.log(JSON.stringify(matchingShipping, undefined, 3));
    return matchingShipping;
}