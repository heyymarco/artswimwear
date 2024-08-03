import {
    // types:
    MatchingShipping,
    MatchingAddress,
    
    
    
    // utilities:
    getMatchingShipping,
}                           from '@/libs/shippings/shippings'

// easypost:
import {
    default as EasyPostClient
}                           from '@easypost/api'


let instanceCache : EasyPostClient|undefined = undefined;
export const getEasyPostInstance = (): EasyPostClient|undefined => {
    if (instanceCache) return instanceCache;
    try {
        const clientSecret = process.env.EASYPOST_SECRET ?? '';
        if (!clientSecret) return undefined;
        
        
        
        instanceCache = new EasyPostClient(clientSecret, {
            // timeout: 5000,
        });
        return instanceCache;
    }
    catch {
        return undefined;
    }
}
