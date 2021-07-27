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

import { PaymentStatus } from './constants';
import { CompletePaymentDto, CreatePaymentDto, UpdatePaymentDto } from './dtos';
import { PaymentEntity } from './entities';
import { PaySuperSecretGuard } from './guards';

import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('/payments')
@UseGuards(PaySuperSecretGuard)
export class PaymentsController {
  constructor(
    @Inject(PaymentsService) private readonly paymentsService: PaymentsService
  ) {}

  @ApiOperation({
    description:
      '[SuperSecret] 새로운 결제건을 생성합니다. 이미 존재하면 입력받은 정보로 업데이트합니다.',
  })
  @Post()
  async createOrUpdate(
    @Body() createPaymentDto: CreatePaymentDto
  ): Promise<PaymentEntity> {
    try {
      const payment = await this.paymentsService.get(
        createPaymentDto.merchantUid
      );
      return await this.paymentsService.update(payment, {
        ...createPaymentDto,
        status: PaymentStatus.Pending,
      });
    } catch {
      return await this.paymentsService.create(createPaymentDto);
    }
  }

  @ApiOperation({ description: '[SuperSecret] 결제건을 수정합니다.' })
  @Patch('/:merchantUid')
  async update(
    @Param('merchantUid') merchantUid: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ): Promise<PaymentEntity> {
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
  async fail(@Param('merchantUid') merchantUid: string) {
    const payment = await this.paymentsService.get(merchantUid);
    await this.paymentsService.fail(payment);
  }

  @ApiOperation({
    description: '[SuperSecret] 지정한 결제건을 완료(paid) 처리합니다.',
  })
  @Post('/:merchantUid/complete')
  async complete(
    @Param('merchantUid') merchantUid: string,
    @Body() completePaymentDto: CompletePaymentDto
  ) {
    const payment = await this.paymentsService.get(merchantUid);
    await this.paymentsService.complete(payment, completePaymentDto);
  }
}
