import {
    stateCityToIdMap,
} from './stateCityToIdMap'

import {
    State,
    City,
} from 'country-state-city'



const originId   = stateCityToIdMap.get('DI Yogyakarta/Yogyakarta'.trim().toLowerCase()) ?? (() => { throw 'Error'; })();
const weightGram = 1000;
const courier    = 'jne';



const kalimantanBarat = [
    { name: 'Kabupaten Bengkayang' },
    { name: 'Kabupaten Kapuas Hulu' },
    { name: 'Kabupaten Kayong Utara' },
    { name: 'Kabupaten Ketapang' },
    { name: 'Kabupaten Kubu Raya' },
    { name: 'Kabupaten Landak' },
    { name: 'Kabupaten Melawi' },
    { name: 'Kabupaten Mempawah' },
    { name: 'Kabupaten Sambas' },
    { name: 'Kabupaten Sanggau' },
    { name: 'Kabupaten Sekadau' },
    { name: 'Kabupaten Sintang' },
    { name: 'Kota Pontianak' },
    { name: 'Kota Singkawang' },
];



let counter = 0;
for (const { name: stateRaw, isoCode } of (State.getStatesOfCountry('ID') ?? [])) {
    const state = stateRaw.trim().toLowerCase();
    for (const { name: cityRaw } of ((stateRaw !== 'Kalimantan Barat') ? (City.getCitiesOfState('ID', isoCode)) : kalimantanBarat)) {
        const city = cityRaw.trim().toLowerCase();
        const destinationId = stateCityToIdMap.get(`${state}/${city}`.trim().toLowerCase());
        if (destinationId === undefined) {
            // console.log(`['${stateRaw}/${cityRaw}', 'ERROR']`);
            continue;
        } // if
        
        
        
        try {
            const res = await fetch('https://api.rajaongkir.com/starter/cost', {
                method  : 'POST',
                headers : {
                    'key': process.env.RAJAONGKIR_SECRET ?? '',
                    'Content-Type': 'application/json',
                },
                body    : JSON.stringify({
                    origin      : originId,
                    destination : destinationId,
                    weight      : weightGram,
                    courier     : courier,
                }),
            });
            const json = await res.json();
            const {
                rajaongkir : {
                    results : [
                        {
                            costs : costsRaw,
                        },
                    ],
                },
            } = json;
            const serviceTypes = costsRaw.map((serviceType: any) => [serviceType.service, serviceType.cost]);
            console.log((++counter), `['${stateRaw}/${cityRaw}', ${JSON.stringify(serviceTypes)}],`);
        }
        catch (error: any) {
            console.log((++counter), `['${stateRaw}/${cityRaw}', 'ERROR', ${error}]`);
        } // try
        
        
        
        await new Promise<void>((resolve) => {
            setTimeout(resolve, (10 + (Math.random() * 30)) * 1000);
        });
    } // for
} // for
