import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { Item } from '@item/items/models';

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

  @ManyToOne('ItemsExhibitionEntity', 'exhibitionItems')
  exhibition: IItemsExhibition;
  @Column({ type: 'int', nullable: true })
  exhibitionId: number;

  @Field(() => Item)
  @ManyToOne('ItemEntity')
  item: Item;
  @Column({ type: 'int', nullable: true })
  itemId: number;

  @Field(() => Int)
  @Column({ type: 'smallint', default: 0 })
  order: number;
}
