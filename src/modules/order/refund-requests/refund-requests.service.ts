import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { OrdersService } from '@order/orders/orders.service';
import { CancelPaymentInput } from '@payment/payments/dtos';
import { PaymentsService } from '@payment/payments/payments.service';

import { RefundRequestRelationType } from './constants';
import { RefundRequestFilter } from './dtos';
import { RefundRequest } from './models';

import { RefundRequestsRepository } from './refund-requests.repository';

@Injectable()
export class RefundRequestsService {
  constructor(
    @InjectRepository(RefundRequestsRepository)
    private readonly refundRequestsRepository: RefundRequestsRepository,
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService
  ) {}

  async get(
    merchantUid: string,
    relations: RefundRequestRelationType[]
  ): Promise<RefundRequest> {
    return await this.refundRequestsRepository.get(merchantUid, relations);
  }

  async list(
    refundRequestFilter?: RefundRequestFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<RefundRequest[]> {
    const _refundRequestFilter = plainToClass(
      RefundRequestFilter,
      refundRequestFilter
    );
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.refundRequestsRepository.entityToModelMany(
      await this.refundRequestsRepository.find({
        relations,
        where: parseFilter(_refundRequestFilter, _pageInput?.idFilter),
        order: {
          merchantUid: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async confirm(merchantUid: string, shippingFee?: number) {
    const refundRequest = await this.get(merchantUid, ['orderItems']);
    refundRequest.confirm(shippingFee);

    const amount = refundRequest.amount - refundRequest.shippingFee;

    const order = await this.ordersService.get(refundRequest.orderMerchantUid, [
      'vbankReceipt',
    ]);
    await this.paymentsService.cancel(
      order.merchantUid,
      CancelPaymentInput.of(order, '반품', amount)
    );

    return await this.refundRequestsRepository.save(refundRequest);
  }
}
