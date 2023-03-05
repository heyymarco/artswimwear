// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Product from '@/models/Product'
import { formatPath } from '@/libs/formatters';



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
            // await new Promise<void>((resolve) => {
            //     setTimeout(() => {
            //         resolve();
            //     }, 2000);
            // });
            // for (const prod of await Product.find({})) {
            //     if (prod.images.length) continue;
            //     prod.images = [
            //         '1.jpg',
            //         '2.jpg',
            //         '3.jpg',
            //         '4.jpg',
            //         '5.jpg',
            //         '6.jpg',
            //     ];
            //     await prod.save();
            //     console.log('product updated!');
            // }
            const products = await Product.find({}, { name: true, price: true, images: true, path: true });
            let productPaths : string[]|undefined = undefined;
            for (const product of products) {
                if (!product.path) {
                    let productPath = formatPath(product.name);
                    
                    // check for duplicates:
                    if (!productPaths) productPaths = products.map((product) => product.path).filter((path) => !!path);
                    if (productPaths.includes(productPath)) {
                        let newProductPath = productPath;
                        for (let counter = 2; counter < 100 && productPaths.includes(newProductPath = `${productPath}-${counter}`); counter++) ;
                        productPath = newProductPath;
                    } // if
                    
                    // assign new pre-computed path:
                    product.path = productPath;
                    await product.save();
                    console.log('path updated: ', productPath);
                }
            }
            return res.status(200).json(products);
        
        
        
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
