import {
    type InterceptEventHandler,
}                           from '@/components/explorers/Pagination'

// models:
import {
    type Pagination,
    type WishGroupDetail,
}                           from '@/models'



// handlers:
interface InterceptPaginationCache {
    equality    : [number, ...string[]]
    intercepted : Pagination<WishGroupDetail>
}
let interceptedPaginationCacheRef : WeakRef<InterceptPaginationCache>|undefined = undefined;
export const handleWishGroupPageIntercept : InterceptEventHandler<WishGroupDetail> = (state) => {
    // conditions:
    if (state.pageNum !== 0) return; // nothing to modify
    const data = state.data;
    if (data === undefined) return; // no data => nothing to modify
    
    
    
    // read from cache:
    const equality : InterceptPaginationCache['equality'] = [data.total, ...data.entities.map(({ id }) => id)];
    const cached   = interceptedPaginationCacheRef?.deref();
    if (cached && cached.equality.every((eq, index) => (eq === equality[index]))) {
        // console.log('CACHE HIT');
        state.data = cached.intercepted;
        return;
    } // if
    
    
    
    // create a new cache:
    const newCache : InterceptPaginationCache = {
        equality    : equality,
        intercepted : {
            entities : [
                {
                    id   : '', // empty string => no id
                    name : 'All Wishlist',
                } satisfies WishGroupDetail,
                ...data.entities,
            ],
            total    : data.total + 1,
        },
    };
    interceptedPaginationCacheRef = new WeakRef<InterceptPaginationCache>(newCache);
    state.data = newCache.intercepted;
    // console.log('CACHE MISS', { eq: equality, ca: cached});
};
