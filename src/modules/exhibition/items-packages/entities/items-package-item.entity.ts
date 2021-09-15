import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { Item } from '@item/items/models';

import { IItemsPackageItem, IItemsPackage } from '../interfaces';

@ObjectType()
@Entity({ name: 'items_package_item' })
export class ItemsPackageItemEntity
  extends BaseIdEntity
  implements IItemsPackageItem
{
  constructor(attributes?: Partial<ItemsPackageItemEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.package = attributes.package;
    this.packageId = attributes.packageId;

    this.item = attributes.item;
    this.itemId = attributes.itemId;

    this.order = attributes.order;
  }

  @ManyToOne('ItemsPackageEntity', 'packageItems')
  package: IItemsPackage;
  @Column({ type: 'int', nullable: true })
  packageId: number;

  @Field(() => Item)
  @ManyToOne('ItemEntity')
  item: Item;
  @Column({ type: 'int', nullable: true })
  itemId: number;

  @Field(() => Int)
  @Column({ type: 'smallint', default: 0 })
  order: number;
}
