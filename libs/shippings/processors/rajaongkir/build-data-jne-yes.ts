import { buildData } from './build-data.js'



await buildData({
    serviceType             : /YES|CTCYES/,
    serviceName             : 'JNE Yes',
    fallbacksToHighestPrice : false,
    outputFile              : './data-jne-yes.json',
});