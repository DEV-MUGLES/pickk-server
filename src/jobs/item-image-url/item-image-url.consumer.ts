import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';

import { IItemImageUrlJob } from './item-image.interface';

import { ITEM_IMAGE_URL_QUEUE_NAME } from './item-image-url.constant';
import { ItemsService } from '@src/modules/item/items/items.service';

@Processor(ITEM_IMAGE_URL_QUEUE_NAME)
export class ItemImageUrlConsumer {
  constructor(private readonly itemsService: ItemsService) {}

  @Process()
  async sync(job: Job<IItemImageUrlJob>) {
    const { itemId, imageUrl } = job.data;
  }
}
