import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '../constants';
import { UpdateItemImageUrlDto } from '../interfaces';

@Injectable()
export class ItemImageUrlProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async update(updateItemImageUrlDto: UpdateItemImageUrlDto) {
    await this.sqsService.send<UpdateItemImageUrlDto>(
      UPDATE_ITEM_IMAGE_URL_QUEUE,
      {
        id: updateItemImageUrlDto.itemId.toString(),
        body: updateItemImageUrlDto,
      }
    );
  }
}
