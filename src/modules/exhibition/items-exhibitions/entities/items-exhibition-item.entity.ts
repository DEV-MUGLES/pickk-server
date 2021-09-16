import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItem } from '@item/items/interfaces';

import { IItemsExhibitionItem, IItemsExhibition } from '../interfaces';

@ObjectType()
@Entity({ name: 'items_exhibition_item' })
export class ItemsExhibitionItemEntity
  extends BaseIdEntity
  implements IItemsExhibitionItem
{
  constructor(attributes?: Partial<ItemsExhibitionItemEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.exhibition = attributes.exhibition;
    this.exhibitionId = attributes.exhibitionId;

    this.item = attributes.item;
    this.itemId = attributes.itemId;

    this.order = attributes.order;
  }

  @ManyToOne('ItemsExhibitionEntity', 'exhibitionItems', {
    onDelete: 'CASCADE',
  })
  exhibition: IItemsExhibition;
  @Column()
  exhibitionId: number;

  @ManyToOne('ItemEntity', { onDelete: 'CASCADE' })
  item: IItem;
  @Column()
  itemId: number;

  @Column({ type: 'smallint', default: 0 })
  order: number;
}
