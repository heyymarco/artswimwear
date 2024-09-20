import {
    type InterceptEventHandler,
}                           from '@/components/explorers/Pagination'

// models:
import {
    type Pagination,
}                           from '@/libs/types'
import {
    type WishGroupDetail,
}                           from '@/models'



// handlers:
interface InterceptPaginationCache {
    original    : Pagination<WishGroupDetail>
    intercepted : Pagination<WishGroupDetail>
}
let interceptedPaginationCacheRef : WeakRef<InterceptPaginationCache>|undefined = undefined;
export const handleWishGroupPageIntercept : InterceptEventHandler<WishGroupDetail> = (state) => {
    if (state.page === 1) {
        const data = state.data;
        if (data) {
            const cached = interceptedPaginationCacheRef?.deref();
            if (cached && (cached.original === data)) return {
                ...state,
                data : cached.intercepted,
            };
            
            
            
            const newCache : InterceptPaginationCache = {
                original    : data,
                intercepted : {
                    entities : [
                        {
                            id   : '', // empty string => no id
                            name : 'All items',
                        } satisfies WishGroupDetail,
                        ...data.entities,
                    ],
                    total    : data.total + 1,
                },
            };
            interceptedPaginationCacheRef = new WeakRef<InterceptPaginationCache>(newCache);
            return {
                ...state,
                data : newCache.intercepted,
            };
        } // if
    } // if
    
    
    
    return state;
};
