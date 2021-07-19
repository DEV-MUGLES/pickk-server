import faker from 'faker';
import { Injectable } from '@nestjs/common';

import { BrandsService } from '@item/brands/brands.service';
import { Item } from '@item/items/models';
import { CreateItemInput, CreateItemOptionInput } from '@item/items/dtos';
import { ItemsService } from '@item/items/items.service';

import { ITEM_COUNT } from '../data';

@Injectable()
export class ItemsSeeder {
  constructor(
    private itemsService: ItemsService,
    private brandsService: BrandsService
  ) {}

  createItemInputs(brandId: number): CreateItemInput[] {
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
        brandId,
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
    const { brandIds, brandCount } = await this.brandsService
      .list()
      .then((brands) => ({
        brandIds: brands.map((brand) => brand.id),
        brandCount: brands.length,
      }));

    return await Promise.all(
      this.createItemInputs(
        brandIds[faker.datatype.number({ min: 0, max: brandCount })]
      ).map(
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
