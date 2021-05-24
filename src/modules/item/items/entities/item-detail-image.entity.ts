import { Entity, ManyToOne } from 'typeorm';

import { AbstractImageEntity } from '@src/common/entities/image.entity';
import { ItemEntity } from './item.entity';
import { ObjectType } from '@nestjs/graphql';

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
