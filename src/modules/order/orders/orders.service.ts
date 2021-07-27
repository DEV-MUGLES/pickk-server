import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { Product } from '@item/products/models';
import { ProductsService } from '@item/products/products.service';
import { Coupon } from '@order/coupons/models';

import { CreateOrderVbankReceiptInput, StartOrderInput } from './dtos';
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
}
