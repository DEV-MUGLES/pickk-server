import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nest-sqs';

import { IItemImageUrlJob } from './item-image.interface';
import { UPDATE_ITEM_IMAGE_URL_QUEUE } from './item-image-url.constant';

@Injectable()
export class ItemImageUrlProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async add(createDto: IItemImageUrlJob) {
    return await this.sqsService.send<IItemImageUrlJob>(
      UPDATE_ITEM_IMAGE_URL_QUEUE,
      {
        id: createDto.itemId.toString(),
        body: createDto,
      }
    );
  }
}
