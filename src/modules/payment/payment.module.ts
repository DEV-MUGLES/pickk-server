import { Module } from '@nestjs/common';

import { InicisModule } from './inicis/inicis.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [InicisModule, PaymentsModule],
})
export class PaymentModule {}
