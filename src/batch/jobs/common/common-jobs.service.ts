import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { IndexItemsJob } from './index-items';
import { IndexDigestsJob } from './index-digests';
import { IndexLooksJob } from './index-looks';
import { IndexVideosJob } from './index-videos';
import { IndexOrderItemsJob } from './index-order-items';

@Injectable()
export class CommonJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly indexItemsJob: IndexItemsJob,
    private readonly indexDigestsJob: IndexDigestsJob,
    private readonly indexLooksJob: IndexLooksJob,
    private readonly indexVideosJob: IndexVideosJob,
    private readonly indexOrderItemsJob: IndexOrderItemsJob
  ) {}

  async indexItems() {
    return await this.batchWorker.run(this.indexItemsJob);
  }

  async indexDigests() {
    return await this.batchWorker.run(this.indexDigestsJob);
  }

  async indexLooks() {
    return await this.batchWorker.run(this.indexLooksJob);
  }

  async indexVideos() {
    return await this.batchWorker.run(this.indexVideosJob);
  }

  async indexOrderItems() {
    return await this.batchWorker.run(this.indexOrderItemsJob);
  }
}
