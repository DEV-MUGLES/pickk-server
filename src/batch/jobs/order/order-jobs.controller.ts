import { Post, UseGuards } from '@nestjs/common';

import { SuperSecretGuard } from '@auth/guards';

import { JobsController } from '../decorators';

import { OrderJobsService } from './order-jobs.service';

@JobsController('order')
@UseGuards(SuperSecretGuard)
export class OrderJobsController {
  constructor(private readonly orderJobsService: OrderJobsService) {}

  @Post('/process-delayed-exchange-requests')
  async processDelayedExchangeRequests() {
    await this.orderJobsService.processDelayedExchangeRequests();
  }

  @Post('/process-delayed-order-items')
  async processDelayedOrderItems() {
    await this.orderJobsService.processDelayedOrderItems();
  }

  @Post('/process-delayed-refund-requests')
  async processDelayedRefundRequests() {
    await this.orderJobsService.processDelayedRefundRequests();
  }
}
