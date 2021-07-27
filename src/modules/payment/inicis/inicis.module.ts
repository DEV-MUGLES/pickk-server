import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PaymentsModule } from '@payment/payments/payments.module';

import { InicisController } from './inicis.controller';
import { InicisService } from './inicis.service';

@Module({
  imports: [forwardRef(() => PaymentsModule), HttpModule],
  controllers: [InicisController],
  providers: [InicisService],
  exports: [InicisService],
})
export class InicisModule {}
