import { Entity, ManyToOne } from 'typeorm';

import { AbstractImageEntity } from '@src/common/entities/image.entity';
import { ItemEntity } from './item.entity';

@Entity({
  name: 'item_detail_image',
})
export class ItemDetailImageEntity extends AbstractImageEntity {
  @ManyToOne('ItemEntity', 'detailImages', {
    onDelete: 'CASCADE',
  })
  item: ItemEntity;
}
