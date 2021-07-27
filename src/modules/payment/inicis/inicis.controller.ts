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

import { InicisService } from './inicis.service';

@ApiTags('inicis')
@Controller('/inicis')
export class InicisController {
  constructor(
    @Inject(PaymentsService) private readonly paymentsService: PaymentsService,
    @Inject(InicisService) private readonly inicisService: InicisService
  ) {}

  // @TODO: SQS로 주문 결제 완료 처리
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
    return 'OK';
  }

  // @TODO: SQS로 주문 결제 완료 처리
  @UseGuards(MobVbankNotiGuard)
  @Post('/mob/vbank-noti')
  async acceptMobVbankNoti(@Body() dto: InicisMobVbankNotiDto): Promise<'OK'> {
    if (dto.P_STATUS !== '02') {
      throw new AbnormalVbankNotiException();
    }

    const payment = await this.paymentsService.findOne({
      merchantUid: dto.P_OID,
    });
    await this.inicisService.validateMobVbankNoti(dto, payment);
    await this.paymentsService.confirmVbankPaid(payment);
    return 'OK';
  }

  @Post('/prepare')
  async prepare(
    @Body() dto: CreatePaymentDto,
    now?: Date
  ): Promise<InicisPrepareResponseDto> {
    const timestamp = new Date(now).getTime().toString();
    await this.paymentsService.createOrUpdate(dto);

    return InicisPrepareResponseDto.of(dto.merchantUid, dto.amount, timestamp);
  }
}
