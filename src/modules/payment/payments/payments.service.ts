import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { parseFilter } from '@common/helpers';
import { SlackService } from '@providers/slack';

import { InicisService } from '@payment/inicis/inicis.service';

import { PaymentStatus } from './constants';
import {
  CancelPaymentInput,
  CreatePaymentDto,
  UpdatePaymentDto,
  CompletePaymentDto,
  PaymentFilter,
} from './dtos';
import { Payment } from './models';

import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsRepository)
    private readonly paymentsRepository: PaymentsRepository,
    private readonly inicisService: InicisService,
    private readonly slackService: SlackService
  ) {}

  async get(merchantUid: string, relations: string[] = []): Promise<Payment> {
    return await this.paymentsRepository.get(merchantUid, relations);
  }

  async list(
    paymentFilter?: PaymentFilter,
    relations: string[] = []
  ): Promise<Payment[]> {
    const _paymentFilter = plainToClass(PaymentFilter, paymentFilter);

    return this.paymentsRepository.entityToModelMany(
      await this.paymentsRepository.find({
        relations,
        where: parseFilter(_paymentFilter),
        order: {
          merchantUid: 'DESC',
        },
      })
    );
  }

  async createOrUpdate(dto: CreatePaymentDto): Promise<Payment> {
    try {
      const payment = await this.get(dto.merchantUid);
      return await this.update(payment, {
        ...dto,
        status: PaymentStatus.Pending,
      });
    } catch {
      return await this.create(dto);
    }
  }

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = new Payment({
      ...dto,
      status: PaymentStatus.Pending,
    });
    return await this.paymentsRepository.save(payment);
  }

  async update(
    payment: Payment,
    updatePaymentDto: UpdatePaymentDto
  ): Promise<Payment> {
    return await this.paymentsRepository.save(
      new Payment({
        ...payment,
        ...updatePaymentDto,
      })
    );
  }

  async findOne(
    param: Partial<Payment>,
    relations: string[] = []
  ): Promise<Payment | null> {
    return this.paymentsRepository.entityToModel(
      await this.paymentsRepository.findOne({ where: param, relations })
    );
  }

  async cancel(merchantUid: string, input: CancelPaymentInput) {
    try {
      const payment = await this.get(merchantUid, ['cancellations']);
      payment.cancel(input);

      await this.inicisService.cancel({
        cancelledPayment: payment,
        ...input,
      });
      await this.paymentsRepository.save(payment);
    } catch (err) {
      console.log(err);
      await this.slackService.sendOldPayCancelRequested(merchantUid, input);
    }
  }

  async dodgeVbank(merchantUid: string) {
    const payment = await this.get(merchantUid);
    payment.dodgeVbank();

    await this.inicisService.dodgeVbank(payment);
    await this.paymentsRepository.save(payment);
  }

  async confirmVbankPaid(payment: Payment): Promise<Payment> {
    payment.confirmVbankPaid();
    return await this.paymentsRepository.save(payment);
  }

  async remove(merchantUid: string): Promise<void> {
    const payment = await this.get(merchantUid);

    if (
      ![PaymentStatus.Pending, PaymentStatus.Failed].includes(payment.status)
    ) {
      throw new BadRequestException(
        '미결제 상태인 결제건만 삭제할 수 있습니다.'
      );
    }

    await this.paymentsRepository.remove(payment);
  }

  async fail(payment: Payment): Promise<Payment> {
    payment.fail();
    return await this.paymentsRepository.save(payment);
  }

  async complete(payment: Payment, dto: CompletePaymentDto): Promise<Payment> {
    payment.complete(dto);
    return await this.paymentsRepository.save(payment);
  }
}
