import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SuperSecretGuard } from '@auth/guards';

import { CompletePaymentDto, UpdatePaymentDto } from './dtos';
import { Payment } from './models';

import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('/payments')
@UseGuards(SuperSecretGuard)
export class PaymentsController {
  constructor(
    @Inject(PaymentsService) private readonly paymentsService: PaymentsService
  ) {}

  @ApiOperation({ description: '[SuperSecret] 결제건을 수정합니다.' })
  @Patch('/:merchantUid')
  async update(
    @Param('merchantUid') merchantUid: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ): Promise<Payment> {
    const payment = await this.paymentsService.get(merchantUid, [
      'cancellations',
    ]);
    return await this.paymentsService.update(payment, updatePaymentDto);
  }

  @ApiOperation({ description: '[SuperSecret] 지정한 결제건을 삭제합니다.' })
  @Delete('/:merchantUid')
  async remove(@Param('merchantUid') merchantUid: string) {
    const payment = await this.paymentsService.get(merchantUid);
    await this.paymentsService.remove(payment);
  }

  @ApiOperation({
    description: '[SuperSecret] 지정한 결제건을 실패 처리합니다.',
  })
  @Post('/:merchantUid/fail')
  async fail(@Param('merchantUid') merchantUid: string): Promise<Payment> {
    const payment = await this.paymentsService.get(merchantUid);
    return await this.paymentsService.fail(payment);
  }

  @ApiOperation({
    description: '[SuperSecret] 지정한 결제건을 완료(paid) 처리합니다.',
  })
  @Post('/:merchantUid/complete')
  async complete(
    @Param('merchantUid') merchantUid: string,
    @Body() completePaymentDto: CompletePaymentDto
  ): Promise<Payment> {
    const payment = await this.paymentsService.get(merchantUid);
    return await this.paymentsService.complete(payment, completePaymentDto);
  }
}
