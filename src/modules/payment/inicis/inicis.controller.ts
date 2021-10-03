import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreatePaymentDto } from '@payment/payments/dtos';
import { PaymentsService } from '@payment/payments/payments.service';

import {
  InicisMobVbankNotiDto,
  InicisStdVbankNotiDto,
  InicisPrepareResponseDto,
} from './dtos';
import { AbnormalVbankNotiException } from './exceptions';
import { StdVbankNotiGuard, MobVbankNotiGuard } from './guards';
import { InicisProducer } from './producers';

import { InicisService } from './inicis.service';

@ApiTags('inicis')
@Controller('/inicis')
export class InicisController {
  constructor(
    @Inject(PaymentsService) private readonly paymentsService: PaymentsService,
    @Inject(InicisService) private readonly inicisService: InicisService,
    private readonly inicisProducer: InicisProducer
  ) {}

  @UseGuards(StdVbankNotiGuard)
  @Post('/std/vbank-noti')
  async acceptStdVbankNoti(@Body() dto: InicisStdVbankNotiDto): Promise<'OK'> {
    if (dto.type_msg !== '0200') {
      throw new AbnormalVbankNotiException();
    }

    const payment = await this.paymentsService.findOne({
      merchantUid: dto.no_oid,
    });
    await this.inicisService.validateStdVbankNoti(dto, payment);
    await this.paymentsService.confirmVbankPaid(payment);
    await this.inicisProducer.processVbankPaidOrder(payment.merchantUid);
    await this.inicisProducer.sendVbankPaidAlimtalk(payment.merchantUid);
    return 'OK';
  }

  @UseGuards(MobVbankNotiGuard)
  @Post('/mob/vbank-noti')
  async acceptMobVbankNoti(@Body() dto: InicisMobVbankNotiDto): Promise<'OK'> {
    console.log(dto);
    if (dto.P_STATUS !== '02') {
      throw new AbnormalVbankNotiException();
    }

    const payment = await this.paymentsService.findOne({
      merchantUid: dto.P_OID,
    });
    await this.inicisService.validateMobVbankNoti(dto, payment);
    await this.paymentsService.confirmVbankPaid(payment);
    await this.inicisProducer.processVbankPaidOrder(payment.merchantUid);
    await this.inicisProducer.sendVbankPaidAlimtalk(payment.merchantUid);
    return 'OK';
  }

  @Post('/prepare')
  async prepare(
    @Body() dto: CreatePaymentDto
  ): Promise<InicisPrepareResponseDto> {
    const timestamp = Date.now().toString();
    await this.paymentsService.createOrUpdate(dto);

    return InicisPrepareResponseDto.of(dto.merchantUid, dto.amount, timestamp);
  }
}
