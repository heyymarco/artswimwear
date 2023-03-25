// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Country from '@/models/Country'



try {
    await connectDB(); // top level await
    console.log('connected to mongoDB!');
}
catch (error) {
    console.log('FAILED to connect mongoDB!');
    throw error;
} // try



export default async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    switch(req.method) {
        case 'GET':
            if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            } // if
            
            
            
            const countryList = await Country.find({
                // enabled: true
            }, { _id: false, name: true, code: true, enabled: true });
            if (!countryList.length) {
                const defaultCountries = (await import('@/libs/defaultCountries')).default;
                await Country.insertMany(defaultCountries);
            }
            return res.status(200).json(
                countryList
                .filter((country) => country.enabled)
                .map((country) => ({
                    name : country.name,
                    code : country.code,
                }))
            );
    } // switch
};
