import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '@queue/constants';
import { UpdateItemImageUrlMto } from '@queue/mtos';

import { UPDATE_ITEM_IMAGE_URL_PRODUCER_BATCH_SIZE } from '../constants';

@Injectable()
export class ItemsProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async updateImageUrl(mtos: UpdateItemImageUrlMto[]) {
    const messages = mtos.map((mto) => ({
      id: mto.itemId ? mto.itemId.toString() : mto.brandId + mto.code,
      body: mto,
    }));
    const batchSize = UPDATE_ITEM_IMAGE_URL_PRODUCER_BATCH_SIZE;
    const chunk = Math.ceil(messages.length / batchSize);

    for (let i = 0; i < chunk; i++) {
      await this.sqsService.send<UpdateItemImageUrlMto>(
        UPDATE_ITEM_IMAGE_URL_QUEUE,
        messages.slice(i * batchSize, (i + 1) * batchSize)
      );
    }
  }
}
