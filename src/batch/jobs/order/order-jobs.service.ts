import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { ProcessDelayedExchangeRequestsJob } from './process-delayed-exchange-requests';
import { ProcessDelayedOrderItemsJob } from './process-delayed-order-items';
import { ProcessDelayedRefundRequestsJob } from './process-delayed-refund-requests';

@Injectable()
export class OrderJobsService {
  constructor(
    private readonly bacthWorker: BatchWorker,
    private readonly processDelayedExchangeRequestsJob: ProcessDelayedExchangeRequestsJob,
    private readonly processDelayedOrderItemsJob: ProcessDelayedOrderItemsJob,
    private readonly processDelayedRefundRequestsJob: ProcessDelayedRefundRequestsJob
  ) {}

  async processDelayedExchangeRequests() {
    await this.bacthWorker.run(this.processDelayedExchangeRequestsJob);
  }
  async processDelayedOrderItems() {
    await this.bacthWorker.run(this.processDelayedOrderItemsJob);
  }
  async processDelayedRefundRequests() {
    await this.bacthWorker.run(this.processDelayedRefundRequestsJob);
  }
}
