import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AbstractImageEntity } from '@common/entities';

import { IItem } from '../interfaces';

@ObjectType()
@Entity({
  name: 'item_detail_image',
})
export class ItemDetailImageEntity extends AbstractImageEntity {
  constructor(attributes?: Partial<ItemDetailImageEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.item = attributes.item;
    this.itemId = attributes.itemId;

    this.order = attributes.order;
  }

  @ManyToOne('ItemEntity', 'detailImages', { onDelete: 'CASCADE' })
  item: IItem;
  @Field(() => Int)
  @Column()
  itemId: number;

  @Field(() => Int)
  @Column({ type: 'tinyint', default: 0, unsigned: true })
  order: number;
}
