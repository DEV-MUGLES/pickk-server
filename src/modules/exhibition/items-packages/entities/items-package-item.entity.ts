import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItem } from '@item/items/interfaces';

import { IItemsPackageItem, IItemsPackage } from '../interfaces';

@ObjectType({ description: '프론트엔드에는 노출되지 않는다.' })
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

  @ManyToOne('ItemsPackageEntity', 'packageItems', { onDelete: 'CASCADE' })
  package: IItemsPackage;
  @Column()
  packageId: number;

  @ManyToOne('ItemEntity', { onDelete: 'CASCADE' })
  item: IItem;
  @Column()
  itemId: number;

  @Field(() => Int)
  @Column({ type: 'smallint', default: 0 })
  order: number;
}
