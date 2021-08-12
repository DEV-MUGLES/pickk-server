import { JobsController } from '../decorators';

import { OrderJobsService } from './order-jobs.service';

@JobsController('order')
export class OrderJobsController {
  constructor(private readonly orderJobsService: OrderJobsService) {}

  async processDelayedExchangeRequests() {
    await this.orderJobsService.processDelayedExchangeRequests();
  }

  async processDelayedOrderItems() {
    await this.orderJobsService.processDelayedOrderItems();
  }

  async processDelayedRefundRequests() {
    await this.orderJobsService.processDelayedRefundRequests();
  }
}
