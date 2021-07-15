import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nest-sqs';

import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '../constants/item-image-url.constant';
import { UpdateItemImageUrlDto } from '../interfaces/item-image-url.interface';

@Injectable()
export class ItemImageUrlProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async send(updateItemImageUrlDto: UpdateItemImageUrlDto) {
    return await this.sqsService.send<UpdateItemImageUrlDto>(
      UPDATE_ITEM_IMAGE_URL_QUEUE,
      {
        id: updateItemImageUrlDto.itemId.toString(),
        body: updateItemImageUrlDto,
      }
    );
  }
}
