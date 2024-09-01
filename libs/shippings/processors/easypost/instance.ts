// easypost:
import {
    type default as EasyPostClient
}                           from '@easypost/api'



let instanceCache : EasyPostClient|undefined = undefined;
export const getEasyPostInstance = async (): Promise<EasyPostClient|undefined> => {
    if (instanceCache) return instanceCache;
    try {
        const clientSecret = process.env.EASYPOST_SECRET ?? '';
        if (!clientSecret) return undefined;
        
        
        
        const EasyPostClient = (await import('@easypost/api')).default;
        instanceCache = new EasyPostClient(clientSecret, {
            // timeout: 5000,
        });
        return instanceCache;
    }
    catch {
        return undefined;
    }
}
