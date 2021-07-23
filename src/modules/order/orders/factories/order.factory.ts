import { NotEnoughStockException } from '@item/products/exceptions';
import { Product } from '@item/products/models';
import { OrderItemStatus } from '@order/order-items/constants';
import { OrderItem } from '@order/order-items/models';

import { OrderStatus } from '../constants';
import { Order } from '../models';

export type OrderFactoryProductsInfo = Array<{
  product: Product;
  quantity: number;
}>;

export class OrderFactory {
  static create(
    userId: number,
    merchantUid: string,
    productsInfo: OrderFactoryProductsInfo
  ): Order {
    this.checkStocks(productsInfo);

    const orderItems = this.createOrderItems(userId, merchantUid, productsInfo);

    const totalItemFinalPrice = orderItems.reduce(
      (acc, oi) => acc + oi.itemFinalPrice,
      0
    );
    const totalShippingFee = this.calcTotalShippingFee(productsInfo);
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

  private static checkStocks(productsInfo: OrderFactoryProductsInfo) {
    for (const { product, quantity } of productsInfo) {
      if (product.stockThreshold < quantity) {
        throw new NotEnoughStockException(product, quantity);
      }
    }
  }

  private static createOrderItems(
    userId: number,
    orderMerchantUid: string,
    productsInfo: OrderFactoryProductsInfo
  ): OrderItem[] {
    return productsInfo.map(({ product, quantity }, index) => {
      const { item, itemOptionValues } = product;
      const { brand } = item;
      const { seller } = brand;

      const merchantUid = orderMerchantUid + index.toString().padStart(2, '0');

      const brandNameKor = brand.nameKor;
      const itemName = item.name;
      const productVariantName = itemOptionValues
        .map((value) => value.name)
        .join('/');

      const orderItem = new OrderItem({
        merchantUid,
        userId,
        sellerId: seller.id,
        itemId: item.id,
        productId: product.id,
        orderMerchantUid,
        status: OrderItemStatus.Pending,
        quantity,
        itemFinalPrice: item.finalPrice,
        brandNameKor,
        itemName,
        productVariantName,
        courierId: seller.courierId,
      });

      if (product.isShipReserving) {
        orderItem.shipReservedAt =
          product.shippingReservePolicy.estimatedShippingBegginDate;
      }

      return orderItem;
    });
  }

  private static calcTotalShippingFee(
    productsInfo: OrderFactoryProductsInfo
  ): number {
    const brandsInfo = new Map<
      number,
      { minimumAmountForFree: number; fee: number; totalItemFinalPrice: number }
    >();

    for (const { product, quantity } of productsInfo) {
      const { finalPrice, brand } = product.item;
      const { fee, minimumAmountForFree } = brand.seller.shippingPolicy;

      if (!brandsInfo.has(brand.id)) {
        brandsInfo.set(brand.id, {
          minimumAmountForFree,
          fee,
          totalItemFinalPrice: 0,
        });
      }

      brandsInfo.get(brand.id).totalItemFinalPrice += finalPrice * quantity;
    }

    let totalShippingFee = 0;
    brandsInfo.forEach(({ minimumAmountForFree, fee, totalItemFinalPrice }) => {
      if (totalItemFinalPrice < minimumAmountForFree) {
        totalShippingFee += fee;
      }
    });

    return totalShippingFee;
  }
}
