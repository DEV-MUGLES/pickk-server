import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { Product } from '@item/products/models';
import { ProductsService } from '@item/products/products.service';
import { CouponsService } from '@order/coupons/coupons.service';
import { CancelPaymentInput } from '@payment/payments/dtos';
import { PaymentStatus, PayMethod } from '@payment/payments/constants';
import { PaymentsService } from '@payment/payments/payments.service';
import { UsersService } from '@user/users/users.service';

import {
  CANCEL_ORDER_RELATIONS,
  OrderRelationType,
  REFUND_ORDER_RELATIONS,
  START_ORDER_RELATIONS,
} from './constants';
import {
  CancelOrderInput,
  CreateOrderVbankReceiptInput,
  OrderFilter,
  RequestOrderRefundInput,
  StartOrderInput,
} from './dtos';
import { OrderFactory } from './factories';
import { Order } from './models';
import { OrdersProducer } from './producers';

import { OrdersRepository } from './orders.repository';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    private readonly couponsService: CouponsService,
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
    private readonly ordersProducer: OrdersProducer
  ) {}

  async checkBelongsTo(merchantUid: string, userId: number): Promise<void> {
    const isMine = await this.ordersRepository.checkBelongsTo(
      merchantUid,
      userId
    );
    if (!isMine) {
      throw new ForbiddenException('자신의 주문이 아닙니다.');
    }
  }

  async get(
    merchantUid: string,
    relations: OrderRelationType[] = []
  ): Promise<Order> {
    return await this.ordersRepository.get(merchantUid, relations);
  }

  async list(
    filter?: OrderFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<Order[]> {
    const _filter = plainToClass(OrderFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.ordersRepository.entityToModelMany(
      await this.ordersRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        order: {
          merchantUid: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
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
    merchantUid: string,
    startOrderInput: StartOrderInput
  ): Promise<Order> {
    const { orderItemInputs, receiverInput } = startOrderInput;

    const couponIds = orderItemInputs?.map((v) => v.usedCouponId) || [];
    const usedCoupons =
      couponIds.length > 0
        ? await this.couponsService.list({ idIn: couponIds }, null, ['spec'])
        : [];

    const shippingAddress = await this.usersService.getShippingAddress(
      receiverInput.shippingAddressId
    );

    const order = await this.get(merchantUid, START_ORDER_RELATIONS);
    order.start(startOrderInput, shippingAddress, usedCoupons);
    await this.productsService.bulkDestock(order.orderItems);

    return await this.ordersRepository.save(order);
  }

  async fail(merchantUid: string): Promise<Order> {
    const order = await this.get(merchantUid, ['orderItems']);
    order.markFailed();
    return await this.ordersRepository.save(order);
  }

  async complete(
    merchantUid: string,
    createOrderVbankReceiptInput?: CreateOrderVbankReceiptInput
  ): Promise<Order> {
    const order = await this.get(merchantUid, [
      'orderItems',
      'vbankReceipt',
      'buyer',
      'receiver',
    ]);

    const { status } = await this.paymentsService.get(merchantUid);
    const paymentStatusMustBe =
      order.payMethod === PayMethod.Vbank
        ? PaymentStatus.VbankReady
        : PaymentStatus.Paid;
    if (status !== paymentStatusMustBe) {
      throw new BadRequestException('결제가 정상적으로 처리되지 않았습니다.');
    }

    order.complete(createOrderVbankReceiptInput);
    const completedOrder = await this.ordersRepository.save(order);
    await this.ordersProducer.sendOrderCompletedAlimtalk(order);
    return completedOrder;
  }

  async dodgeVbank(merchantUid: string): Promise<Order> {
    const order = await this.get(merchantUid, ['orderItems']);
    order.markVbankDodged();
    await this.paymentsService.dodgeVbank(merchantUid);
    return await this.ordersRepository.save(order);
  }

  async cancel(
    merchantUid: string,
    { reason, orderItemMerchantUids }: CancelOrderInput
  ): Promise<Order> {
    const order = await this.get(merchantUid, CANCEL_ORDER_RELATIONS);

    const { amount, checksum } = order.cancel(orderItemMerchantUids);

    await this.paymentsService.cancel(
      merchantUid,
      CancelPaymentInput.of(order, reason, amount, checksum)
    );
    return await this.ordersRepository.save(order);
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
