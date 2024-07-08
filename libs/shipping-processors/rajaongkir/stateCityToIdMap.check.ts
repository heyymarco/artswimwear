import {
    stateCityToIdMap,
} from './stateCityToIdMap.fixed.js'

import {
    State,
    City,
} from 'country-state-city'



const found      = new Map<string, string>();
const notDefined : string[] = [];
for (const { name: stateRaw, isoCode } of (State.getStatesOfCountry('ID') ?? [])) {
    const state = stateRaw.trim().toLowerCase();
    for (const { name: cityRaw } of (City.getCitiesOfState('ID', isoCode))) {
        const city = cityRaw.trim().toLowerCase();
        const stateCity                      = `${state}/${city}`;
        const stateKotaCity                  = `${state}/${city.startsWith('kota '                  ) ? city.slice( 5) : city}`; // remove prefix 'kota '
        const stateKabupatenCity             = `${state}/${city.startsWith('kabupaten '             ) ? city.slice(10) : city}`; // remove prefix 'kabupaten '
        const stateKotaAdministrasiCity      = `${state}/${city.startsWith('kota administrasi '     ) ? city.slice(18) : city}`; // remove prefix 'kota administrasi '
        const stateKabupatenAdministrasiCity = `${state}/${city.startsWith('kabupaten administrasi ') ? city.slice(23) : city}`; // remove prefix 'kabupaten administrasi '
        if (stateCityToIdMap.has(stateCity)) {
            found.set(stateCity, stateCityToIdMap.get(stateCity)!);
        }
        else if(stateCityToIdMap.has(stateKotaCity)) {
            found.set(stateCity, stateCityToIdMap.get(stateKotaCity)!);
        }
        else if(stateCityToIdMap.has(stateKabupatenCity)) {
            found.set(stateCity, stateCityToIdMap.get(stateKabupatenCity)!);
        }
        else if(stateCityToIdMap.has(stateKotaAdministrasiCity)) {
            found.set(stateCity, stateCityToIdMap.get(stateKotaAdministrasiCity)!);
        }
        else if(stateCityToIdMap.has(stateKabupatenAdministrasiCity)) {
            found.set(stateCity, stateCityToIdMap.get(stateKabupatenAdministrasiCity)!);
        }
        else {
            notDefined.push(`NOT DEFINED : ${stateCity}`);
        } // if
    } // for
} // for
const foundKeys = Array.from(found.keys()).map((key) => key.replace(/(?<=\/)(kota|kabupaten) (administrasi )?/gi, ''));
const notFound  = (
    Array.from(stateCityToIdMap.keys())
    .filter((key) => {
        const keyNorm = key.replace(/(?<=\/)(kota|kabupaten) (administrasi )?/gi, '');
        return !foundKeys.includes(keyNorm);
    })
    .map((key) => `NOT FOUND : ${key}`)
);

const foundSorted = new Map<string, string>(Array.from(found.entries()).toSorted(([keyA], [keyB]) => (keyA === keyB) ? 0 : ((keyA < keyB) ? -1 : 1)));

// for (const item of notDefined) {
//     console.log(item);
// } // for

// for (const item of notFound) {
//     console.log(item);
// } // for

for (const [key, id] of foundSorted.entries()) {
    console.log(`['${key}', '${id}'],`);
} // for


// const states = State.getStatesOfCountry('ID');
// for (const state of states) {
//     console.log(state.name, state.isoCode);
// } // for

// const cities = City.getCitiesOfState('ID', 'KB');
// for (const city of cities) {
//     console.log(city.name);
// } // for


/*

NOT FOUND : aceh/pidie jaya                     // gak ada "piede jaya", cuma ada "piede"
NOT FOUND : dki jakarta/kepulauan seribu        // gak ada "kepulauan seribu" di jakarta
NOT FOUND : kalimantan barat/bengkayang
NOT FOUND : kalimantan barat/kapuas hulu
NOT FOUND : kalimantan barat/kayong utara
NOT FOUND : kalimantan barat/ketapang
NOT FOUND : kalimantan barat/kubu raya
NOT FOUND : kalimantan barat/landak
NOT FOUND : kalimantan barat/melawi
NOT FOUND : kalimantan barat/pontianak
NOT FOUND : kalimantan barat/sambas
NOT FOUND : kalimantan barat/sanggau
NOT FOUND : kalimantan barat/sekadau
NOT FOUND : kalimantan barat/singkawang
NOT FOUND : kalimantan barat/sintang
NOT FOUND : lampung/tulangbawang barat          // gak ada "tulangbawang barat", cuma ada "tulangbawang"
NOT FOUND : maluku utara/halmahera timur        // gak ada "halmahera timur", cuma ada "halmahera (utara|selatan|tengah|barat)"
NOT FOUND : papua barat/pegunungan arfak        // gak ada "pegunungan arfak" di papua barat

*/