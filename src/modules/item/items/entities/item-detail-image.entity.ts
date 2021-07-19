import { Entity, ManyToOne } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';

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
  }

  @ManyToOne('ItemEntity', 'detailImages', {
    onDelete: 'CASCADE',
  })
  item: ItemEntity;
}
