import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '@src/queue/constants';
import { UpdateItemImageUrlByCodeMto } from '@src/queue/mtos';

@Injectable()
export class ItemImageUrlProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async updateBycode(brandId: number, code: string, imageUrl: string) {
    await this.sqsService.send<UpdateItemImageUrlByCodeMto>(
      UPDATE_ITEM_IMAGE_URL_QUEUE,
      {
        id: brandId + code,
        body: { brandId, code, imageUrl },
      }
    );
  }
}
