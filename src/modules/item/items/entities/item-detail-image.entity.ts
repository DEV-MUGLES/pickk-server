import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { AbstractImageEntity } from '@common/entities';

import { ItemEntity } from './item.entity';

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
  }

  @ManyToOne('ItemEntity', 'detailImages', { onDelete: 'CASCADE' })
  item: ItemEntity;
  @Field(() => Int)
  @Column()
  itemId: number;
}
