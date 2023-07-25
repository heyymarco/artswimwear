import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

// models:
import type {
    Country,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// types:
export interface CountryPreview
    extends
        Pick<Country,
            |'name'
            |'code'
        >
{
}



const router = createRouter<
    NextApiRequest,
    NextApiResponse<
        | Array<CountryPreview>
        | { error: string }
    >
>();



router
.get(async (req, res) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    const countryList = await prisma.country.findMany({
        select: {
            enabled : true,
            name    : true,
            
            code    : true,
        }
        // enabled: true
    });
    if (!countryList.length) {
        const defaultCountries = (await import('@/libs/defaultCountries')).default;
        await prisma.country.createMany({
            data: defaultCountries,
        });
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



export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
});
