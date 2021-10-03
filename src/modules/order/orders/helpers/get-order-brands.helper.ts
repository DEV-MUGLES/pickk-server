import { OrderItemClaimStatus } from '@order/order-items/constants';
import { OrderItem } from '@order/order-items/models';

import { OrderBrand } from '../models';

// 취소된 orderItem은 제외한다.
export const getOrderBrands = (orderItems: OrderItem[]): OrderBrand[] => {
  const brandItemsMap = new Map<number, OrderBrand>();

  orderItems.forEach((orderItem) => {
    const { seller } = orderItem;
    const { minimumAmountForFree, fee } = seller.shippingPolicy;

    if (!brandItemsMap.has(seller.brandId)) {
      brandItemsMap.set(seller.brandId, {
        id: seller.brandId,
        nameKor: seller.brand.nameKor,
        imageUrl: seller.brand.imageUrl,
        shippingFee: fee,
        totalItemFinalPrice: 0,
        items: [],
      });
    }

    const orderBrand = brandItemsMap.get(seller.brandId);
    orderBrand.items.push(orderItem);
    if (orderItem.claimStatus !== OrderItemClaimStatus.Cancelled) {
      orderBrand.totalItemFinalPrice +=
        orderItem.itemFinalPrice * orderItem.quantity;
    }

    if (orderBrand.totalItemFinalPrice >= minimumAmountForFree) {
      orderBrand.shippingFee = 0;
    }
  });

  return [...brandItemsMap.values()];
};
