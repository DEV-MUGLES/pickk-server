import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@src/batch/batch.worker';

import { UpdateItemIsSoldoutJob } from './update-item-is-soldout';
import { UpdateItemScoreJob } from './update-item-score';
import { UpdateSellerItemsJob } from './update-seller-items';

@Injectable()
export class ItemJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly updateSellerItemsJob: UpdateSellerItemsJob,
    private readonly updateItemIsSoldoutJob: UpdateItemIsSoldoutJob,
    private readonly updateItemScoreJob: UpdateItemScoreJob
  ) {}

  async updateSellerItems() {
    return await this.batchWorker.run(this.updateSellerItemsJob);
  }

  async updateItemIsSoldout() {
    return await this.batchWorker.run(this.updateItemIsSoldoutJob);
  }

  async updateItemScore() {
    return await this.batchWorker.run(this.updateItemScoreJob);
  }
}
