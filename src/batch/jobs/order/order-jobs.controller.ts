import { Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SuperSecretGuard } from '@auth/guards';

import { JobsController } from '../decorators';

import { OrderJobsService } from './order-jobs.service';

@ApiTags('jobs')
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

  @Post('/send-delayed-order-items-alimtalk')
  async sendDelayedOrderItemsAlimtalk() {
    await this.orderJobsService.sendDelayedOrderItemsAlimtalk();
  }

  @Post('/send-delayed-exchange-requests-alimtalk')
  async sendDelayedExchangeRequestsAlimtalk() {
    await this.orderJobsService.sendDelayedExchangeRequestsAlimtalk();
  }

  @Post('/send-delayed-refund-requests-alimtalk')
  async sendDelayedRefundRequestsAlimtalk() {
    await this.orderJobsService.sendDelayedRefundRequestsAlimtalk();
  }
}
