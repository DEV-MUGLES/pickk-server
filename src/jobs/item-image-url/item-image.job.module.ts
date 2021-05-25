import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { ItemsModule } from '@src/modules/item/items/items.module';

import { ItemImageUrlConsumer } from './item-image-url.consumer';
import { ItemImageUrlProducer } from './item-image.producer';

import { ITEM_IMAGE_URL_QUEUE_NAME } from './item-image-url.constant';
import { ImagesModule } from '@src/modules/common/images/images.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ITEM_IMAGE_URL_QUEUE_NAME,
      settings: {
        maxStalledCount: 500,
      },
    }),
    forwardRef(() => ItemsModule),
    ImagesModule,
  ],
  providers: [ItemImageUrlProducer, ItemImageUrlConsumer],
  exports: [ItemImageUrlProducer],
})
export class ItemImageUrlJobModule {}
