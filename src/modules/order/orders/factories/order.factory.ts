import { checkStocks } from '@item/products/helpers';
import {
  OrderItemFactory,
  OrderItemFactoryProductInfo,
} from '@order/order-items/factories';
import { OrderItem } from '@order/order-items/models';

import { OrderStatus } from '../constants';
import { calcTotalShippingFee } from '../helpers';
import { Order } from '../models';

export type OrderFactoryProductsInfo = OrderItemFactoryProductInfo[];

export class OrderFactory {
  static create(
    userId: number,
    merchantUid: string,
    productsInfo: OrderFactoryProductsInfo
  ): Order {
    checkStocks(productsInfo);

    const orderItems = this.createOrderItems(userId, merchantUid, productsInfo);

    const totalItemFinalPrice = orderItems.reduce(
      (acc, oi) => acc + oi.itemFinalPrice,
      0
    );
    const totalShippingFee = calcTotalShippingFee(productsInfo);
    const totalPayAmount = totalItemFinalPrice + totalShippingFee;

    return new Order({
      userId,
      merchantUid,
      status: OrderStatus.Pending,
      orderItems,
      totalItemFinalPrice,
      totalShippingFee,
      totalPayAmount,
    });
  }

  private static createOrderItems(
    userId: number,
    orderMerchantUid: string,
    productsInfo: OrderFactoryProductsInfo
  ): OrderItem[] {
    return productsInfo.map((productInfo, index) => {
      const merchantUid = orderMerchantUid + index.toString().padStart(2, '0');

      return OrderItemFactory.create(userId, merchantUid, productInfo);
    });
  }
}
