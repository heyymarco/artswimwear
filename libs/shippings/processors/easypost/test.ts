import { default as EasyPostClient } from '@easypost/api'
const client = new EasyPostClient('EZTK706f3b3cd845447683bf98d1524b5b8dRpllrSbQz0sCF0jyMKBl2A');



// const parcel = await client.Parcel.create({ // prcl_d63d3f968484460a84c43a6788e3a827
//     length: 20.2,
//     width: 10.9,
//     height: 5,
//     weight: 65.9,
// });

// console.log(parcel);



const shipment = await client.Shipment.create({
    to_address: {
        name: 'Dr. Steve Brule',
        street1: '179 N Harbor Dr',
        city: 'Redondo Beach',
        state: 'CA',
        zip: '90277',
        country: 'US',
        email: 'dr_steve_brule@gmail.com',
        phone: '4155559999',
    },
    from_address: {
        street1: '417 montgomery street',
        street2: 'FL 5',
        city: 'San Francisco',
        state: 'CA',
        zip: '94104',
        country: 'US',
        company: 'EasyPost',
        phone: '415-123-4567',
    },
    parcel: {
        weight: 16 * 0.001,
    },
});
console.log(shipment.rates.map(({carrier, service, rate, currency}) => ({carrier, service, rate, currency})).filter(({carrier, service}) => (carrier === 'USPS') && (service === 'Express')));
