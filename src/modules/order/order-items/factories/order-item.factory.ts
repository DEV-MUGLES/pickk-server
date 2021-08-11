import { Product } from '@item/products/models';
import { OrderItemStatus } from '../constants';

import { OrderItem } from '../models';

export type OrderItemFactoryProductInfo = {
  product: Product;
  quantity: number;
};

export class OrderItemFactory {
  static create(
    userId: number,
    merchantUid: string,
    { product, quantity }: OrderItemFactoryProductInfo
  ): OrderItem {
    const { item, itemOptionValues } = product;
    const { brand } = item;

    const brandNameKor = brand.nameKor;
    const itemName = item.name;
    const productVariantName = itemOptionValues
      .map((value) => value.name)
      .join('/');

    const orderItem = new OrderItem({
      merchantUid,
      userId,
      sellerId: brand.seller.id,
      itemId: item.id,
      productId: product.id,
      status: OrderItemStatus.Pending,
      quantity,
      itemFinalPrice: item.finalPrice,
      brandNameKor,
      itemName,
      productVariantName,
    });

    if (product.isShipReserving) {
      orderItem.shipReservedAt =
        product.shippingReservePolicy.estimatedShippingBegginDate;
    }

    return orderItem;
  }
}
