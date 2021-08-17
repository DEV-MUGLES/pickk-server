import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { Product } from '@item/products/models';
import { ProductsService } from '@item/products/products.service';
import { Coupon } from '@order/coupons/models';
import { CancelPaymentInput } from '@payment/payments/dtos';
import { PaymentsService } from '@payment/payments/payments.service';

import { CANCEL_ORDER_RELATIONS, REFUND_ORDER_RELATIONS } from './constants';
import {
  CancelOrderInput,
  CreateOrderVbankReceiptInput,
  RequestOrderRefundInput,
  StartOrderInput,
} from './dtos';
import { OrderFactory } from './factories';
import { Order } from './models';

import { OrdersRepository } from './orders.repository';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ProductsService)
    private readonly productsService: ProductsService,
    @Inject(PaymentsService)
    private readonly paymentsService: PaymentsService,
    @InjectRepository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository
  ) {}

  async get(merchantUid: string, relations: string[] = []): Promise<Order> {
    return await this.ordersRepository.get(merchantUid, relations);
  }

  async register(
    userId: number,
    inputs: Array<{ product: Product; quantity: number }>
  ): Promise<Order> {
    const merchantUid = await this.genMerchantUid();

    const order = OrderFactory.create(userId, merchantUid, inputs);
    return this.ordersRepository.save(order);
  }

  async checkBelongsTo(merchantUid: string, userId: number): Promise<boolean> {
    return await this.ordersRepository.checkBelongsTo(merchantUid, userId);
  }

  /** YYMMDDHHmmssSSS + NN 형식의 고유한 merchantUid를 생성합니다. */
  async genMerchantUid(date?: Date): Promise<string> {
    const prefix = dayjs(date).tz('Asia/Seoul').format('YYMMDDHHmmssSSS');

    let merchantUid: string;
    let num = 0;

    do {
      merchantUid = `${prefix}${num.toString().padStart(2, '0')}`;
      num++;
    } while (await this.ordersRepository.checkExist(merchantUid));

    return merchantUid;
  }

  async start(
    order: Order,
    startOrderInput: StartOrderInput,
    usedCoupons: Coupon[]
  ): Promise<Order> {
    order.start(startOrderInput, usedCoupons);
    await this.productsService.bulkDestock(order.orderItems);

    return await this.ordersRepository.save(order);
  }

  async fail(order: Order): Promise<Order> {
    order.fail();
    return await this.ordersRepository.save(order);
  }

  async complete(
    order: Order,
    createOrderVbankReceiptInput?: CreateOrderVbankReceiptInput
  ): Promise<Order> {
    order.complete(createOrderVbankReceiptInput);
    return await this.ordersRepository.save(order);
  }

  async dodgeVbank(merchantUid: string): Promise<Order> {
    const order = await this.get(merchantUid, ['orderItems']);
    order.dodgeVbank();

    await this.paymentsService.dodgeVbank(merchantUid);

    return await this.ordersRepository.save(order);
  }

  async cancel(
    merchantUid: string,
    { reason, orderItemMerchantUids }: CancelOrderInput
  ): Promise<void> {
    const order = await this.get(merchantUid, CANCEL_ORDER_RELATIONS);

    const { amount, checksum } = order.cancel(orderItemMerchantUids);

    const payment = await this.paymentsService.get(merchantUid);
    await this.paymentsService.cancel(
      payment,
      CancelPaymentInput.of(order, reason, amount, checksum)
    );
    await this.ordersRepository.save(order);
  }

  async requestRefund(
    merchantUid: string,
    input: RequestOrderRefundInput
  ): Promise<Order> {
    const order = await this.get(merchantUid, REFUND_ORDER_RELATIONS);

    order.requestRefund(input);

    return await this.ordersRepository.save(order);
  }
}
