import { Field, ObjectType } from '@nestjs/graphql';

import { Item } from '@item/items/models';

import { ItemsPackageEntity } from '../entities';

import { ItemsPackageItem } from './items-package-item.model';

@ObjectType()
export class ItemsPackage extends ItemsPackageEntity {
  packageItems: ItemsPackageItem[];

  @Field(() => [Item])
  get items(): Item[] {
    if (!this.packageItems) {
      return [];
    }

    return this.packageItems
      .sort((a, b) => a.order - b.order)
      .map((v) => v.item);
  }
}
