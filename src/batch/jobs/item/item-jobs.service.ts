import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@src/batch/batch.worker';

import { UpdateSellerItemsJob } from './update-seller-items/job';

@Injectable()
export class ItemJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly updateSellerItemsJob: UpdateSellerItemsJob
  ) {}

  async updateSellerItems() {
    await this.batchWorker.run(this.updateSellerItemsJob);
  }
}
