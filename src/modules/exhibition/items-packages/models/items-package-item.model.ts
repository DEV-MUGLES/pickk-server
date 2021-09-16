import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Item } from '@item/items/models';

import { ItemsPackageItemEntity } from '../entities/items-package-item.entity';

@ObjectType()
export class ItemsPackageItem extends ItemsPackageItemEntity {
  @Type(() => Item)
  @Field(() => Item)
  item: Item;
}
