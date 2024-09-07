// models:
import {
    type PublicOrderDetail,
}                           from '@/models'



// utilities:
export const getTotalQuantity = (items: PublicOrderDetail['items']): number => {
    return items.reduce((counter, item) => {
        return counter + item.quantity;
    }, 0);
};
