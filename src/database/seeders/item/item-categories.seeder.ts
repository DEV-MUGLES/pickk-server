import faker from 'faker';
import { getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { ItemCategory } from '@item/item-categories/models/item-category.model';
import { ItemCategoryEntity } from '@item/item-categories/entities/item-category.entity';
import { ITEM_MAJOR_CATEGORY_COUNT, ITEM_MINOR_CATEGORY_COUNT } from '../data';

@Injectable()
export class ItemCategoriesSeeder {
  async create(): Promise<ItemCategory[]> {
    const manager = getManager();
    const itemMajorCateories = [...Array(ITEM_MAJOR_CATEGORY_COUNT)].map(
      () =>
        new ItemCategoryEntity({
          name: faker.lorem.word(),
          code: faker.datatype.string(14),
        })
    );

    const itemMinorCategories = [...Array(ITEM_MINOR_CATEGORY_COUNT)].map(
      (_, i) =>
        new ItemCategoryEntity({
          name: faker.lorem.word(),
          code: faker.datatype.string(14),
          parent: itemMajorCateories[Math.floor(i / 2)],
        })
    );
    return await manager.save([...itemMajorCateories, ...itemMinorCategories]);
  }
}
