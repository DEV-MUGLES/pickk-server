import dayjs from 'dayjs';
import * as faker from 'faker';

import {
  findModelById,
  getRandomEle,
  getRandomIntBetween,
} from '@common/helpers';

import { Brand } from '@item/brands/models';
import {
  Seller,
  SellerClaimPolicy,
  SellerSaleStrategy,
  SellerShippingPolicy,
} from '@item/sellers/models';
import { Item, ItemOptionValue, ItemPrice } from '@item/items/models';
import { Product } from '@item/products/models';
import { OrderItemFactoryProductInfo } from '@order/order-items/factories';

import { OrderFactory } from '../factories';
import { Order } from '../models';

export class OrderCreator {
  static create(): Order {
    const userId = faker.datatype.number();
    const merchantUid = this.createMerchantUid();
    const productsInfo = this.createProductsInfo(getRandomIntBetween(1, 5));

    const order = OrderFactory.create(userId, merchantUid, productsInfo);
    for (const oi of order.orderItems) {
      oi.seller = findModelById(
        oi.sellerId,
        productsInfo.map((v) => v.product.item.brand.seller)
      );
      oi.item = findModelById(
        oi.itemId,
        productsInfo.map((v) => v.product.item)
      );
      oi.couponDiscountAmount = 0;
      oi.usedPointAmount = 0;
    }
    order.refundRequests = [];

    return order;
  }

  static createMerchantUid(): string {
    return dayjs(faker.date.recent()).format('YYMMDDHHmmssSSS');
  }

  static createProductsInfo(size: number): OrderItemFactoryProductInfo[] {
    const result: OrderItemFactoryProductInfo[] = [];

    for (let i = 0; i < size; i++) {
      const seller = new Seller({
        id: faker.datatype.number(),
        shippingPolicy: new SellerShippingPolicy({
          minimumAmountForFree: getRandomIntBetween(30, 50) * 1000,
          fee: getRandomIntBetween(15, 30) * 100,
        }),
        claimPolicy: new SellerClaimPolicy({
          fee: getRandomIntBetween(15, 30) * 100,
          isExchangable: true,
          isRefundable: true,
        }),
        saleStrategy: new SellerSaleStrategy({
          pickkDiscountRate: 0,
        }),
      });

      const brand = new Brand({
        id: faker.datatype.number(),
        nameKor: faker.name.firstName(),
        seller,
      });

      seller.brand = brand;

      const item = new Item({
        id: faker.datatype.number(),
        name: faker.name.firstName(),
        prices: [
          new ItemPrice({
            isActive: true,
            originalPrice: getRandomIntBetween(30, 55) * 1000,
            sellPrice: getRandomIntBetween(20, 25) * 1000,
            pickkDiscountRate: 5,
          }),
        ],
        brand,
        campaigns: [],
      });

      const itemOptionValues = [
        new ItemOptionValue({
          name: getRandomEle(['S, M, L, 100, 105, 110']),
          priceVariant: 0,
        }),
        new ItemOptionValue({
          name: getRandomEle(['S, M, L, 100, 105, 110']),
          priceVariant: 0,
        }),
      ];

      const product = new Product({
        priceVariant: getRandomIntBetween(0, 15) * 100,
        item,
        itemOptionValues,
        stock: 9999999,
      });

      result.push({
        product,
        quantity: getRandomIntBetween(1, 3),
      });
    }

    return result;
  }
}
