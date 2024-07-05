// models:
import {
    type ShippingEta,
    type ShippingRate,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    // types:
    type MatchingAddress,
}                           from '@/libs/shippings'
import {
    stateCityToIdMap,
}                           from './stateCityToIdMap'



// utilities:
const systemShippings : string[] = [
    'jne reguler',
    'jne yes',
    'jne oke',
];



export interface UpdateShippingProviderData {

}
export const updateShippingProvider = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], shippingAddress: MatchingAddress): Promise<void> => {
    const {
        country,
        state,
        city,
    } = shippingAddress;
    if (country.trim().toLowerCase() !== 'id') return; // indonesia only, international is not supported yet
    const destinationId = stateCityToIdMap.get(`${state.trim().toLowerCase()}/${city.trim().toLowerCase()}`);
    if (destinationId === undefined) return; // the destination id is not known => abort updating
    
    
    
    const shippingProviders = await prismaTransaction.shippingProvider.findMany({
        where  : {
            autoUpdate : true, // autoUpdate is enabled
            NOT : {
                origin : null, // has origin defined
            },
            name : {
                mode   : 'insensitive',
                in     : systemShippings,
            },
        },
        select : {
            id         : true, // required for updating later
            name       : true, // required for updating later
            origin     : true, // required for rajaOngkir fetching
        },
    });
    
    
    
    const shippingProvidersWithUnique = (
        shippingProviders
        .map((shippingProvider) => {
            let baseName = shippingProvider.name.trim().toLowerCase();
            switch (baseName) {
                case 'jne reguler':
                case 'jne oke':
                case 'jne yes':
                    baseName = 'jne';
                    break;
            } // switch
            
            
            
            const {
                country = '',
                state   = '',
                city    = '',
            } = shippingProvider.origin ?? {};
            
            
            
            return {
                // key: the uniqueness by combination of baseName + country + state + city
                unique: `${baseName}/${country.trim().toLowerCase()}/${state.trim().toLowerCase()}/${city.trim().toLowerCase()}`,
                
                // value:
                ...shippingProvider,
            };
        })
    );
    
    
    
    const newShippingData = (
        (await Promise.all(
            Array.from(
                new Map(
                    shippingProvidersWithUnique
                    .map(({unique, ...value}) => [unique, value])
                )
                .values()
            )
            .map(({ origin }) => {
                if (!origin) return null;
                const {
                    country,
                    state,
                    city,
                } = origin;
                if (country.trim().toLowerCase() !== 'id') return null; // indonesia only, international is not supported yet
                const originId = stateCityToIdMap.get(`${state.trim().toLowerCase()}/${city.trim().toLowerCase()}`);
                if (originId === undefined) return null; // the origin id is not known => abort updating
                
                
                
                try {
                    return getShippingJne(originId, destinationId);
                }
                catch {
                    return null;
                } // try
            })
        ))
        .filter((newShippingItem): newShippingItem is Exclude<typeof newShippingItem, null> => !!newShippingItem)
        .flat() // flatten the shippingProvider (Reguler|Oke|Yes)
    );
}



interface ShippingData {
    name  : string
    eta   : ShippingEta|null
    rates : ShippingRate[]
}
const getShippingJne = async (originId: string, destinationId: string): Promise<ShippingData[]> => {
    const res = await fetch('https://api.rajaongkir.com/starter/cost', {
        method  : 'POST',
        headers : {
            'key': 'd1ed66bcc966b31be08289752c1b1bbf',
            'Content-Type': 'application/json',
        },
        body    : JSON.stringify({
            origin      : originId,
            destination : destinationId,
            weight      : 1000 /* gram */,
            courier     : 'jne',
        }),
    });
    
    
    
    const shippingServices       = await handleRajaongkirResponse(await res.json());
    const shippingServiceReguler = shippingServices.find(({ type }) => (/REG|CTC/i).test(type));
    const shippingServiceOke     = shippingServices.find(({ type }) => (/OKE/i).test(type));
    const shippingServiceYes     = shippingServices.find(({ type }) => (/YES|CTCYES/i).test(type));
    return (
        [
            !shippingServiceReguler ? null : {
                name          : 'JNE Reguler',
                eta           : shippingServiceReguler.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceReguler.costIDR,
                    }
                ],
            } satisfies ShippingData,
            
            !shippingServiceOke ? null : {
                name          : 'JNE Oke',
                eta           : shippingServiceOke.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceOke.costIDR,
                    }
                ],
            } satisfies ShippingData,
            
            !shippingServiceYes ? null : {
                name          : 'JNE Yes',
                eta           : shippingServiceYes.eta,
                rates : [
                    {
                        start : 0,
                        rate  : shippingServiceYes.costIDR,
                    }
                ],
            } satisfies ShippingData,
        ]
        .filter((shippingItem): shippingItem is Exclude<typeof shippingItem, null> => !!shippingItem)
    );
}



interface ShippingService {
    type    : string
    eta     : ShippingEta|null
    costIDR : number
}
const handleRajaongkirResponse = async (json: any): Promise<ShippingService[]> => {
    const {
        rajaongkir : {
            results : [
                {
                    costs : costsRaw,
                },
            ],
        },
    } = json;
    const serviceTypes : ShippingService[] = costsRaw.map((serviceType: any): ShippingService => {
        const type = serviceType.service;
        const cost = serviceType.cost[0];
        const etas = (
            (cost.etd as string)
            .split('-')
            .map((etaStr: string) => {
                if (!etaStr) return null;
                const eta = Number.parseFloat(etaStr);
                if (!isFinite(eta)) return null;
                return eta;
            })
        );
        const [etaMin, etaMax] = etas;
        return {
            type    : type,
            eta     : ((etaMin === null) || (etaMin === undefined)) ? null : {
                min : etaMin,
                max : ((etaMax === null) || (etaMax === undefined) || (etaMax < etaMin)) ? etaMin : etaMax,
            } satisfies ShippingEta,
            costIDR : cost.value,
        };
    });
    return serviceTypes;
}