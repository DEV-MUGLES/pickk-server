import { Entity } from 'typeorm';

import { AbstractImageEntity } from '@src/common/entities/image.entity';

@Entity({
  name: 'item_thumbnail_image',
})
export class ItemThumbnailImageEntity extends AbstractImageEntity {}
