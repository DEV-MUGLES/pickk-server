import { OrderItem } from '@order/order-items/models';

import { OrderBrand } from '../models';

export const getOrderBrands = (orderItems: OrderItem[]): OrderBrand[] => {
  const brandItemsMap = new Map<number, OrderBrand>();

  orderItems.forEach((orderItem) => {
    const { seller } = orderItem;
    const { minimumAmountForFree, fee } = seller.shippingPolicy;

    if (!brandItemsMap.has(seller.id)) {
      brandItemsMap.set(seller.id, {
        nameKor: seller.brand.nameKor,
        imageUrl: seller.brand.imageUrl,
        shippingFee: fee,
        totalItemFinalPrice: 0,
        items: [],
      });
    }

    const orderSheetBrand = brandItemsMap.get(seller.id);
    orderSheetBrand.items.push(orderItem);
    orderSheetBrand.totalItemFinalPrice += orderItem.itemFinalPrice;

    if (orderSheetBrand.totalItemFinalPrice >= minimumAmountForFree) {
      orderSheetBrand.shippingFee = 0;
    }
  });

  return [...brandItemsMap.values()];
};
