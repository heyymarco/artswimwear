import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Country, CountrySchema } from '@/models/Country'



try {
    await connectDB(); // top level await
    console.log('connected to mongoDB!');
}
catch (error) {
    console.log('FAILED to connect mongoDB!');
    throw error;
} // try



export default nextConnect<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something broke!' });
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
})
.get<NextApiRequest, NextApiResponse<Array<Pick<CountrySchema, 'name'|'code'>>>>(async (req, res) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    const countryList = await Country.find<Pick<CountrySchema, 'enabled'|'name'|'code'>>({
        // enabled: true
    }, { _id: false, enabled: true, name: true, code: true });
    if (!countryList.length) {
        const defaultCountries = (await import('@/libs/defaultCountries')).default;
        await Country.insertMany(defaultCountries);
    } // if
    
    
    
    return res.json(
        countryList
        .filter((country) => country.enabled)
        .map((country) => ({
            name : country.name,
            code : country.code,
        }))
    );
});
