import { OrderItemStatus } from '../constants';

import { OrderItem } from '../models';

export type OrderItemFactoryProductInfo = Required<
  Pick<OrderItem, 'product' | 'quantity'>
> & {
  recommendDigest?: {
    id: number;
    user: {
      id: number;
      nickname: string;
    };
  };
};

export type OrderItemFactorShipInfo = Pick<
  OrderItem,
  'isFreeShippingPackage' | 'shippingFee'
>;

export class OrderItemFactory {
  static create(
    userId: number,
    merchantUid: string,
    { product, quantity, recommendDigest }: OrderItemFactoryProductInfo,
    shipInfo: OrderItemFactorShipInfo
  ): OrderItem {
    const { item, itemOptionValues, priceVariant, shippingReservePolicy } =
      product;

    const productVariantName = itemOptionValues
      .map((value) => value.name)
      .join('/');

    const orderItem = new OrderItem({
      merchantUid,
      userId,
      sellerId: item.brand.seller.id,
      itemId: item.id,
      productId: product.id,
      status: OrderItemStatus.Pending,
      quantity,
      itemFinalPrice: item.finalPrice + priceVariant,
      brandNameKor: item.brand.nameKor,
      itemName: item.name,
      productVariantName,
      ...(recommendDigest && {
        recommendDigestId: recommendDigest.id,
        recommenderId: recommendDigest.user.id,
        recommenderNickname: recommendDigest.user.nickname,
      }),
      ...shipInfo,
      ...(product.isShipReserving && {
        isShipReserved: true,
        shipReservedAt: shippingReservePolicy.estimatedShippingBegginDate,
      }),
    });

    return orderItem;
  }
}
