import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import axios from 'axios';

import { ItemsService } from '@src/modules/item/items/items.service';

import { IItemImageUrlJob } from './item-image.interface';

import { ITEM_IMAGE_URL_QUEUE_NAME } from './item-image-url.constant';
import { ImagesService } from '@src/modules/common/images/images.service';
import { getMimeType } from '@src/modules/common/images/helpers/image.helper';

@Processor(ITEM_IMAGE_URL_QUEUE_NAME)
export class ItemImageUrlConsumer {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly itemsService: ItemsService
  ) {}

  @Process()
  async update(job: Job<IItemImageUrlJob>): Promise<void> {
    const { itemId, imageUrl } = job.data;
    const { data } = await axios.get<Buffer>(imageUrl, {
      responseType: 'arraybuffer',
    });

    const mimetype = getMimeType(imageUrl);
    const [result] = await this.imagesService.uploadBufferDatas([
      {
        buffer: data,
        filename: `THUMBNAIL.${mimetype}`,
        mimetype: mimetype,
        prefix: `item/${itemId}`,
      },
    ]);

    const item = await this.itemsService.get(itemId);
    await this.itemsService.update(item, {
      imageUrl: result.url,
    });
  }
}
