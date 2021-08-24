import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@src/batch/batch.worker';

import { UpdateItemIsSoldoutJob } from './update-item-is-soldout';
import { UpdateSellerItemsJob } from './update-seller-items';

@Injectable()
export class ItemJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly updateSellerItemsJob: UpdateSellerItemsJob,
    private readonly updateItemIsSoldoutJob: UpdateItemIsSoldoutJob
  ) {}

  async updateSellerItems() {
    await this.batchWorker.run(this.updateSellerItemsJob);
  }

  async updateItemIsSoldout() {
    await this.batchWorker.run(this.updateItemIsSoldoutJob);
  }
}
