import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { UPDATE_SELLER_ITEMS_QUEUE } from '@src/queue/constants';
import { ScrapSellerItemsMto } from '@src/queue/mtos';

@Injectable()
export class SellerProducer {
  constructor(private readonly sqsService: SqsService) {}

  async updateSellerItems(scrapSellerItemsMto: ScrapSellerItemsMto) {
    await this.sqsService.send<ScrapSellerItemsMto>(UPDATE_SELLER_ITEMS_QUEUE, {
      id: scrapSellerItemsMto.brand.id.toString(),
      body: scrapSellerItemsMto,
    });
  }
}
