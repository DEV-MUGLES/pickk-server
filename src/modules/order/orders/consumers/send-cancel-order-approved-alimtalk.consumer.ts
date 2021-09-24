import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { AlimtalkService } from '@providers/sens';
import { SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendCancelOrderApprovedAlimtalkMto } from '@queue/mtos';

import { OrdersRepository } from '../orders.repository';

@SqsProcess(SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE)
export class SendCancelOrderApprovedAlimtalkConsumer extends BaseConsumer {
  constructor(
    private readonly alimtalkService: AlimtalkService,
    @InjectRepository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const {
      orderItemMerchantUids,
      orderMerchantUid,
    }: SendCancelOrderApprovedAlimtalkMto = JSON.parse(message.Body);

    const canceledOrder = this.ordersRepository.entityToModel(
      await this.ordersRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.buyer', 'buyer')
        .leftJoinAndSelect('order.receiver', 'receiver')
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .where('order.merchantUid = :orderMerchantUid', { orderMerchantUid })
        .andWhere('orderItems.merchantUid IN(:...orderItemMerchantUids)', {
          orderItemMerchantUids,
        })
        .getOne()
    );

    await this.alimtalkService.sendCancelOrderApproved(canceledOrder);
  }
}
