import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '../constants';
import { UpdateItemImageUrlMto } from '../mtos';

@Injectable()
export class ItemImageUrlProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async update(itemId: number, imageUrl: string) {
    await this.sqsService.send<UpdateItemImageUrlMto>(
      UPDATE_ITEM_IMAGE_URL_QUEUE,
      {
        id: itemId.toString(),
        body: { itemId, imageUrl },
      }
    );
  }
}
