import { Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SuperSecretGuard } from '@auth/guards';

import { JobsController } from '../decorators';
import { PaymentJobsService } from './payment-jobs.service';

@ApiTags('jobs')
@JobsController('payment')
@UseGuards(SuperSecretGuard)
export class PaymentJobsController {
  constructor(private readonly paymentJobsService: PaymentJobsService) {}

  @Post('/complete-paid-payments')
  async completePaidPayments() {
    return await this.paymentJobsService.completePaidPayments();
  }
}
