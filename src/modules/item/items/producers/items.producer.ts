import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import {
  UPDATE_ITEM_DETAIL_IMAGES_QUEUE,
  UPDATE_ITEM_IMAGE_URL_QUEUE,
} from '@queue/constants';
import { UpdateItemDetailImagesMto, UpdateItemImageUrlMto } from '@queue/mtos';

@Injectable()
export class ItemsProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async updateImageUrl(mtos: UpdateItemImageUrlMto[]) {
    const messages = mtos.map((mto) => ({
      id: mto.itemId ? mto.itemId.toString() : mto.brandId + mto.code,
      body: mto,
    }));

    await this.sqsService.send<UpdateItemImageUrlMto>(
      UPDATE_ITEM_IMAGE_URL_QUEUE,
      messages
    );
  }

  async updateDetailImages(mtos: UpdateItemDetailImagesMto[]) {
    const messages = mtos.map((mto) => ({
      id: mto.itemId ? mto.itemId.toString() : mto.brandId + mto.code,
      body: mto,
    }));

    await this.sqsService.send<UpdateItemDetailImagesMto>(
      UPDATE_ITEM_DETAIL_IMAGES_QUEUE,
      messages
    );
  }
}
