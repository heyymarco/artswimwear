import { buildData } from './build-data.js'



await buildData({
    serviceType             : /OKE/,
    serviceName             : 'JNE Oke',
    fallbacksToHighestPrice : false,
    outputFile              : './data-jne-oke.json',
});