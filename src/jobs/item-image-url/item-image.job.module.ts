import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SqsModule, SqsQueueType } from '@pickk/nest-sqs';

import { ItemsModule } from '@src/modules/item/items/items.module';
import { ImagesModule } from '@src/modules/common/images/images.module';

import { ItemImageUrlConsumer } from './item-image-url.consumer';
import { ItemImageUrlProducer } from './item-image.producer';
import { UPDATE_ITEM_IMAGE_URL_QUEUE } from './item-image-url.constant';

@Module({
  imports: [
    HttpModule,
    ItemsModule,
    ImagesModule,
    SqsModule.registerQueue([
      {
        name: UPDATE_ITEM_IMAGE_URL_QUEUE,
        type: SqsQueueType.All,
      },
    ]),
  ],
  providers: [ItemImageUrlProducer, ItemImageUrlConsumer],
  exports: [ItemImageUrlProducer],
})
export class ItemImageUrlJobModule {}
