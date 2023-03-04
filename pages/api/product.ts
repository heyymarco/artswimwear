// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Product from '@/models/Product'



type Data = {
    name: string
}



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
            return res.status(200).json(await Product.find());
        
        
        
        case 'POST':
            const newProduct = await Product.create({
                name        : req.query.name,
                price       : Number.parseFloat(req.query.price as any),
                description : req.query.description,
            });
            console.log('a product added: ', newProduct);
            return res.status(200).json(newProduct);
    } // switch
};
