import { buildData } from './build-data.js'



await buildData({
    serviceType             : /REG|CTC/,
    serviceName             : 'JNE Reguler',
    fallbacksToHighestPrice : true,
    outputFile              : './data-jne-reguler.json',
});