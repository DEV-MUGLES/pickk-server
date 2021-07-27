import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { PaymentStatus } from '@pickk/pay';
import dayjs from 'dayjs';

import { parseFilter } from '@common/helpers';
import { InicisService } from '@payment/inicis/inicis.service';

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
    @Inject(InicisService)
    private readonly inicisService: InicisService
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

  async cancel(payment: Payment, cancelPaymentInput: CancelPaymentInput) {
    const cancellation = payment.cancel(cancelPaymentInput);

    await getManager().transaction(async (manager) => {
      await manager.save(cancellation);

      await this.inicisService.cancel({
        ...cancelPaymentInput,
        payment,
      });
    });
  }

  async confirmVbankPaid(payment: Payment): Promise<Payment> {
    payment.confirmVbankPaid();
    return await this.paymentsRepository.save(payment);
  }

  async remove(payment: Payment): Promise<void> {
    if (
      ![PaymentStatus.Pending, PaymentStatus.Failed].includes(payment.status)
    ) {
      throw new BadRequestException(
        '미결제 상태인 결제건만 삭제할 수 있습니다.'
      );
    }
    // check if payment is created before one day
    if (dayjs(payment.createdAt).diff(dayjs(), 'days') < 1) {
      throw new BadRequestException(
        '1일 이내에 생성된 결제건은 삭제할 수 없습니다.'
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
