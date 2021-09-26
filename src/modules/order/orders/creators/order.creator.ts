import dayjs from 'dayjs';
import * as faker from 'faker';

import { getRandomEle, getRandomIntBetween } from '@common/helpers';

import { Brand } from '@item/brands/models';
import { Seller, SellerShippingPolicy } from '@item/sellers/models';
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

    return OrderFactory.create(userId, merchantUid, productsInfo);
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
      });

      const brand = new Brand({
        id: faker.datatype.number(),
        nameKor: faker.name.firstName(),
        seller,
      });

      const item = new Item({
        id: faker.datatype.number(),
        name: faker.name.firstName(),
        prices: [
          new ItemPrice({
            isActive: true,
            finalPrice: getRandomIntBetween(15, 55) * 1000,
          }),
        ],
        brand,
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
