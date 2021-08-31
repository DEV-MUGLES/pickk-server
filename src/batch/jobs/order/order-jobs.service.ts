import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { ConfirmOrderItemsJob } from './confirm-order-items';
import { ProcessDelayedExchangeRequestsJob } from './process-delayed-exchange-requests';
import { ProcessDelayedOrderItemsJob } from './process-delayed-order-items';
import { ProcessDelayedRefundRequestsJob } from './process-delayed-refund-requests';
import { SendDelayedOrderItemsAlimtalkJob } from './send-delayed-order-items-alimtalk';
import { SendDelayedExchangeRequestsAlimtalkJob } from './send-delayed-exchange-requests-alimtalk';
import { SendDelayedRefundRequestsAlimtalkJob } from './send-delayed-refund-requests-alimtalk';

@Injectable()
export class OrderJobsService {
  constructor(
    private readonly bacthWorker: BatchWorker,
    private readonly confirmOrderItemsJob: ConfirmOrderItemsJob,
    private readonly processDelayedExchangeRequestsJob: ProcessDelayedExchangeRequestsJob,
    private readonly processDelayedOrderItemsJob: ProcessDelayedOrderItemsJob,
    private readonly processDelayedRefundRequestsJob: ProcessDelayedRefundRequestsJob,
    private readonly sendDelayedOrderItemsAlimtalkJob: SendDelayedOrderItemsAlimtalkJob,
    private readonly sendDelayedExchangeRequestsAlimtalkJob: SendDelayedExchangeRequestsAlimtalkJob,
    private readonly sendDelayedRefundRequestsAlimtalkJob: SendDelayedRefundRequestsAlimtalkJob
  ) {}

  async processDelayedExchangeRequests() {
    return await this.bacthWorker.run(this.processDelayedExchangeRequestsJob);
  }

  async processDelayedOrderItems() {
    return await this.bacthWorker.run(this.processDelayedOrderItemsJob);
  }

  async processDelayedRefundRequests() {
    return await this.bacthWorker.run(this.processDelayedRefundRequestsJob);
  }

  async sendDelayedOrderItemsAlimtalk() {
    return await this.bacthWorker.run(this.sendDelayedOrderItemsAlimtalkJob);
  }

  async sendDelayedExchangeRequestsAlimtalk() {
    return await this.bacthWorker.run(
      this.sendDelayedExchangeRequestsAlimtalkJob
    );
  }

  async sendDelayedRefundRequestsAlimtalk() {
    return await this.bacthWorker.run(
      this.sendDelayedRefundRequestsAlimtalkJob
    );
  }

  async confirmOrderItems() {
    return await this.bacthWorker.run(this.confirmOrderItemsJob);
  }
}
