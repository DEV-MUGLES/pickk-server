import { checkStocks } from '@item/products/helpers';
import {
  OrderItemFactory,
  OrderItemFactoryProductInfo,
} from '@order/order-items/factories';
import { OrderItem } from '@order/order-items/models';

import { OrderStatus } from '../constants';
import { Order } from '../models';

type ShppinFeeMap = Map<
  number,
  { totalItemFinalPrice: number; shippingFee: number }
>;

// @FIXME: 코드 매우 더러움.. 개선 필요
export class OrderFactory {
  static create(
    userId: number,
    merchantUid: string,
    productsInfo: OrderItemFactoryProductInfo[]
  ): Order {
    checkStocks(productsInfo);

    const orderItems = this.createOrderItems(userId, merchantUid, productsInfo);

    return new Order({
      userId,
      merchantUid,
      status: OrderStatus.PENDING,
      orderItems,
    });
  }

  private static createOrderItems(
    userId: number,
    orderMerchantUid: string,
    productsInfo: OrderItemFactoryProductInfo[]
  ): OrderItem[] {
    const shippingFeeMap = this.getShppinFeeMap(productsInfo);
    const isChargedMap = new Map<number, boolean>();

    return productsInfo.map((productInfo, index) => {
      const merchantUid = orderMerchantUid + index.toString().padStart(2, '0');

      const { brandId } = productInfo.product.item;

      const packageShippingFee = shippingFeeMap.get(brandId).shippingFee;

      return OrderItemFactory.create(userId, merchantUid, productInfo, {
        isFreeShippingPackage: packageShippingFee === 0,
        shippingFee: (() => {
          // 이미 부과했으면 0
          if (isChargedMap.get(brandId)) {
            return 0;
          }

          isChargedMap.set(brandId, true);
          return packageShippingFee;
        })(),
      });
    });
  }

  private static getShppinFeeMap(
    productsInfo: OrderItemFactoryProductInfo[]
  ): ShppinFeeMap {
    const result = new Map<
      number,
      { totalItemFinalPrice: number; shippingFee: number }
    >();

    productsInfo.forEach(({ product, quantity }) => {
      const { brandId } = product.item;
      const { shippingPolicy } = product.item.brand.seller;

      const record = result.get(brandId) ?? {
        totalItemFinalPrice: 0,
        shippingFee: 0,
      };

      const totalItemFinalPrice =
        record.totalItemFinalPrice + product.purchasePrice * quantity;

      result.set(brandId, {
        totalItemFinalPrice,
        shippingFee:
          totalItemFinalPrice < shippingPolicy.minimumAmountForFree
            ? shippingPolicy.fee
            : 0,
      });
    });

    return result;
  }
}
