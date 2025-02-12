// models:
import {
    // types:
    type Pagination,
    type ProductPreview,
    
    
    
    // schemas:
    SearchProductsPageRequestSchema,
    
    
    
    // utilities:
    productPreviewSelect,
    convertProductPreviewDataToProductPreview,
    extractKeywords,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-cache';



export const GET = async (req: Request): Promise<Response> => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                pagination  : SearchProductsPageRequestSchema.parse(data),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        pagination : {
            query,
            page,
            perPage,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    // Extract words from query:
    const searchWords = (
        Array.from(new Set<string>(extractKeywords(query))) // Extract unique keywords from search query
        .slice(0, 20) // Limit to max 20 keywords
    );
    
    
    
    //#region query result
    const products = (
        (await prisma.product.findMany({
            where   : {
                visibility : 'PUBLISHED', // allows access to Product with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                OR : [
                    {
                        keywords     : { hasSome: searchWords },
                    },
                    {
                        autoKeywords : { hasSome: searchWords },
                    },
                ],
            },
            select  : {
                id           : true,
                autoKeywords : true,
                keywords     : true,
            },
            take    : 100,
        }))
        .map(({id, autoKeywords, keywords}) => ({
            id,
            keywords : Array.from(new Set<string>([ // Extract unique keywords from `keywords` and `autoKeywords`
                ...keywords,     // higher priority for manually typed keywords
                ...autoKeywords, // lower priority for auto generated keywords
            ])).slice(0, 100),   // Limit to max 100 keywords
        }))
    );
    //#endregion Query result
    
    
    
    //#region Calculate relevance weights
    const scoredRelatedProducts = products.map(product => {
        // Calculate keyword relevance based on order
        const score = searchWords.reduce((acc, word, index) => {
            const keywordIndex = product.keywords.findIndex(keyword => keyword.includes(word));
            if (keywordIndex !== -1) {
                acc += (product.keywords.length - keywordIndex) * (searchWords.length - index); // Higher weight for earlier keywords
            }
            return acc;
        }, 0);
        
        return {
            id : product.id,
            score,
        };
    });
    scoredRelatedProducts.sort(({ score: scoreA }, { score: scoreB }) => (scoreB - scoreA)); // Sort the scores from highest to lowest
    //#endregion Calculate relevance weights
    
    
    
    // Determines the related product IDs:
    const startIndex = page * perPage;
    const endIndex   = startIndex + perPage;
    const slicedIds  = scoredRelatedProducts.slice(startIndex, endIndex).map(({id}) => id);
    
    
    
    //#region validating privileges
    const session = await getServerSession(authOptions);
    const customerId = session?.user?.id ?? undefined; // optional loggedIn (allows for public access too)
    //#endregion validating privileges
    
    
    
    //#region query result
    const paged = slicedIds.length ? await prisma.product.findMany({
        where    : {
            id   : { in: slicedIds },
        },
        select   : productPreviewSelect(customerId),
    }) : [];
    
    // Sort the fetched products to match the order of slicedIds:
    const sortedPaged = (
        slicedIds
        .map((sortedId) => paged.find(({id}) => (id === sortedId)))
        .filter((product): product is Exclude<typeof product, undefined> => (product !== undefined))
    );
    
    const paginationOrderDetail : Pagination<ProductPreview> = {
        total    : scoredRelatedProducts.length,
        entities : sortedPaged.map(convertProductPreviewDataToProductPreview),
    };
    return Response.json(paginationOrderDetail); // handled with success
    //#endregion query result
}
