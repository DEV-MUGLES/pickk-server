import faker from 'faker';
import { Injectable } from '@nestjs/common';

import { Item } from '@item/items/models/item.model';
import { ItemsService } from '@item/items/items.service';
import { CreateItemInput } from '@item/items/dtos/item.input';
import { CreateItemOptionInput } from '@item/items/dtos/item-option.input';
import {
  BRAND_COUNT,
  ITEM_COUNT,
  ITEM_MAJOR_CATEGORY_COUNT,
  ITEM_MINOR_CATEGORY_COUNT,
} from '../data';

@Injectable()
export class ItemsSeeder {
  constructor(private itemsService: ItemsService) {}

  createItemInputs(): CreateItemInput[] {
    return [...Array(ITEM_COUNT)].map(() => {
      const originalPrice = Number(faker.commerce.price(10000, 100000));
      const discountAmount = faker.datatype.number({ min: 1000, max: 5000 });

      const datetimes = [
        faker.datatype.datetime(),
        faker.datatype.datetime(),
      ].sort();

      return {
        name: faker.commerce.productName(),
        imageUrl: faker.image.fashion(),
        description: faker.commerce.productDescription().substring(0, 99),
        providedCode: faker.datatype.string(5),
        isMdRecommended: faker.datatype.boolean(),
        isSellable: faker.datatype.boolean(),
        brandId: faker.datatype.number({ min: 1, max: BRAND_COUNT }),
        majorCategoryId: faker.datatype.number({
          min: 1,
          max: ITEM_MAJOR_CATEGORY_COUNT,
        }),
        minorCategoryId: faker.datatype.number({
          min: ITEM_MAJOR_CATEGORY_COUNT + 1,
          max: ITEM_MAJOR_CATEGORY_COUNT + ITEM_MINOR_CATEGORY_COUNT,
        }),
        priceInput: {
          originalPrice,
          sellPrice: originalPrice - discountAmount,
          pickkDiscountAmount: discountAmount,
          isCrawlUpdating: faker.datatype.boolean(),
          startAt: datetimes[0],
          endAt: datetimes[1],
        },
        urlInput: {
          url: faker.internet.url(),
          isPrimary: faker.datatype.boolean(),
        },
      };
    });
  }

  createItemOptionInputs(): CreateItemOptionInput[] {
    return [...Array(3)].map(() => ({
      name: faker.commerce.department(),
      values: [
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
      ],
    }));
  }

  async create(): Promise<Item[]> {
    return await Promise.all(
      this.createItemInputs().map(
        (itemInput) =>
          new Promise<Item>(async (resolve) => {
            const item = await this.itemsService.create(itemInput);
            await this.itemsService.createOptionSet(
              item,
              this.createItemOptionInputs()
            );
            resolve(item);
          })
      )
    );
  }
}
