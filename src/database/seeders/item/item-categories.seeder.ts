import { getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { ItemCategoryEntity } from '@item/item-categories/entities';
import { ItemCategory } from '@item/item-categories/models';

import { ItemCategories } from '../data';

@Injectable()
export class ItemCategoriesSeeder {
  async create(): Promise<ItemCategory[]> {
    const manager = getManager();
    const itemMajorCateories = ItemCategories.map(
      (majorCates) =>
        new ItemCategoryEntity({
          ...(majorCates as { name: string; code: string }),
        })
    );
    const itemMinorCategories = [];
    ItemCategories.map((majorCates) =>
      majorCates.minorCategories.map(
        (minorCates, index) =>
          new ItemCategoryEntity({
            ...(minorCates as { name: string; code: string }),
            parent: itemMajorCateories[index],
          })
      )
    ).forEach((minorCates) => {
      itemMinorCategories.push(...minorCates);
    });

    return await manager.save([...itemMajorCateories, ...itemMinorCategories]);
  }
}
