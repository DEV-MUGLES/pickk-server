import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@src/batch/batch.worker';

import { UpdateItemScoreJob } from './update-item-score';
import { UpdateItemStateJob } from './update-item-state';
import { UpdateSellerItemsJob } from './update-seller-items';

@Injectable()
export class ItemJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly updateItemStateJob: UpdateItemStateJob,
    private readonly updateItemScoreJob: UpdateItemScoreJob,
    private readonly updateSellerItemsJob: UpdateSellerItemsJob
  ) {}

  async updateItemScore() {
    return await this.batchWorker.run(this.updateItemScoreJob);
  }

  async updateItemState() {
    return await this.batchWorker.run(this.updateItemStateJob);
  }

  async updateSellerItems() {
    return await this.batchWorker.run(this.updateSellerItemsJob);
  }
}
