import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { setQueues, BullAdapter } from 'bull-board';

import { IItemImageUrlJob } from './item-image.interface';

import { ITEM_IMAGE_URL_QUEUE_NAME } from './item-image-url.constant';

@Injectable()
export class ItemImageUrlProducer {
  constructor(
    @InjectQueue(ITEM_IMAGE_URL_QUEUE_NAME)
    private imageUrlQueue: Queue<IItemImageUrlJob>
  ) {
    setQueues([new BullAdapter(this.imageUrlQueue)]);
  }

  async add(createDto: IItemImageUrlJob) {
    return await this.imageUrlQueue.add(createDto);
  }
}
