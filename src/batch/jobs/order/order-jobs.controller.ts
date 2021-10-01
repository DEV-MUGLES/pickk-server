import { Delete, Post, UseGuards } from '@nestjs/common';
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
    return await this.orderJobsService.processDelayedExchangeRequests();
  }

  @Post('/process-delayed-order-items')
  async processDelayedOrderItems() {
    return await this.orderJobsService.processDelayedOrderItems();
  }

  @Post('/process-delayed-refund-requests')
  async processDelayedRefundRequests() {
    return this.orderJobsService.processDelayedRefundRequests();
  }

  @Post('/send-delayed-order-items-alimtalk')
  async sendDelayedOrderItemsAlimtalk() {
    return await this.orderJobsService.sendDelayedOrderItemsAlimtalk();
  }

  @Post('/send-delayed-exchange-requests-alimtalk')
  async sendDelayedExchangeRequestsAlimtalk() {
    return await this.orderJobsService.sendDelayedExchangeRequestsAlimtalk();
  }

  @Post('/send-delayed-refund-requests-alimtalk')
  async sendDelayedRefundRequestsAlimtalk() {
    return await this.orderJobsService.sendDelayedRefundRequestsAlimtalk();
  }

  @Post('/confirm-order-items')
  async confirmOrderItems() {
    return await this.orderJobsService.confirmOrderItems();
  }

  @Delete('/remove-expired-orders')
  async removeExpiredOrders() {
    return await this.orderJobsService.removeExpiredOrders();
  }

  @Delete('/remove-paying-orders')
  async removePayingOrders() {
    return await this.orderJobsService.removePayingOrders();
  }
  @Post('/send-orders-created-alimtalk')
  async sendOrdersCreatedAlimtalkJob() {
    return await this.orderJobsService.sendOrdersCreatedAlimtalk();
  }
}
