import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItem } from '@item/items/interfaces';

import { IItemsGroupItem, IItemsGroup } from '../interfaces';

@ObjectType({ description: '프론트엔드에는 노출되지 않는다.' })
@Entity({ name: 'items_group_item' })
export class ItemsGroupItemEntity
  extends BaseIdEntity
  implements IItemsGroupItem
{
  constructor(attributes?: Partial<ItemsGroupItemEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.group = attributes.group;
    this.groupId = attributes.groupId;

    this.item = attributes.item;
    this.itemId = attributes.itemId;

    this.order = attributes.order;
  }

  @ManyToOne('ItemsGroupEntity', 'groupItems', { onDelete: 'CASCADE' })
  group: IItemsGroup;
  @Column()
  groupId: number;

  @OneToOne('ItemEntity', 'itemsGroupItem', { onDelete: 'CASCADE' })
  @JoinColumn()
  item: IItem;
  @Column()
  itemId: number;

  @Field(() => Int)
  @Column({ type: 'smallint', default: 0 })
  order: number;
}
