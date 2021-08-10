import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '@src/queue/constants';
import { UpdateItemImageUrlMto } from '@src/queue/mtos';

@Injectable()
export class ItemImageUrlProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async update(mto: UpdateItemImageUrlMto) {
    const { itemId, brandId, code } = mto;
    await this.sqsService.send<UpdateItemImageUrlMto>(
      UPDATE_ITEM_IMAGE_URL_QUEUE,
      {
        id: itemId ? itemId.toString() : brandId + code,
        body: mto,
      }
    );
  }
}
