import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { IndexItemsJob } from './index-items';
import { IndexDigestsJob } from './index-digests';
import { IndexLooksJob } from './index-looks';
import { IndexVideosJob } from './index-videos';
import { IndexOrderItemsJob } from './index-order-items';
import { IndexRefundRequestsJob } from './index-refund-requests';
import { IndexExchangeRequestsJob } from './index-exchange-requests';
import { IndexInquiriesJob } from './index-inquiries';

@Injectable()
export class CommonJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly indexItemsJob: IndexItemsJob,
    private readonly indexDigestsJob: IndexDigestsJob,
    private readonly indexLooksJob: IndexLooksJob,
    private readonly indexVideosJob: IndexVideosJob,
    private readonly indexOrderItemsJob: IndexOrderItemsJob,
    private readonly indexRefundRequestsJob: IndexRefundRequestsJob,
    private readonly indexExchangeRequestsJob: IndexExchangeRequestsJob,
    private readonly indexInquiriesJob: IndexInquiriesJob
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

  async indexRefundRequests() {
    return await this.batchWorker.run(this.indexRefundRequestsJob);
  }

  async indexExchangeRequests() {
    return await this.batchWorker.run(this.indexExchangeRequestsJob);
  }

  async indexInquires() {
    return await this.batchWorker.run(this.indexInquiriesJob);
  }
}
