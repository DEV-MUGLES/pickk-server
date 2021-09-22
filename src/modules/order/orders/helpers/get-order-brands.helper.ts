import { OrderItemClaimStatus } from '@order/order-items/constants';
import { OrderItem } from '@order/order-items/models';

import { OrderBrand } from '../models';

// 취소된 orderItem은 제외한다.
export const getOrderBrands = (orderItems: OrderItem[]): OrderBrand[] => {
  const brandItemsMap = new Map<number, OrderBrand>();

  orderItems
    .filter((v) => v.claimStatus !== OrderItemClaimStatus.CANCELLED)
    .forEach((orderItem) => {
      const { seller } = orderItem;
      const { minimumAmountForFree, fee } = seller.shippingPolicy;

      if (!brandItemsMap.has(seller.id)) {
        brandItemsMap.set(seller.id, {
          id: seller.brand.id,
          nameKor: seller.brand.nameKor,
          imageUrl: seller.brand.imageUrl,
          shippingFee: fee,
          totalItemFinalPrice: 0,
          items: [],
        });
      }

      const orderBrand = brandItemsMap.get(seller.id);
      orderBrand.items.push(orderItem);
      orderBrand.totalItemFinalPrice += orderItem.itemFinalPrice;

      if (orderBrand.totalItemFinalPrice >= minimumAmountForFree) {
        orderBrand.shippingFee = 0;
      }
    });

  return [...brandItemsMap.values()];
};
