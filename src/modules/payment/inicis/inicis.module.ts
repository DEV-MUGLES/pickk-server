import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { PaymentsModule } from '@payment/payments/payments.module';
import { PROCESS_VBANK_PAID_ORDER_QUEUE } from '@queue/constants';

import { InicisProducer } from './producers';

import { InicisController } from './inicis.controller';
import { InicisService } from './inicis.service';

@Module({
  imports: [
    forwardRef(() => PaymentsModule),
    HttpModule,
    SqsModule.registerQueue({
      name: PROCESS_VBANK_PAID_ORDER_QUEUE,
      type: SqsQueueType.Producer,
    }),
  ],
  controllers: [InicisController],
  providers: [InicisService, InicisProducer],
  exports: [InicisService],
})
export class InicisModule {}
