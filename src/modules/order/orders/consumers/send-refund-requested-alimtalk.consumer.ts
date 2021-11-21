import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';
import { plainToClass } from 'class-transformer';

import { AlimtalkService } from '@providers/sens';
import { SEND_REFUND_REQUESTED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendRefundRequestedAlimtalkMto } from '@queue/mtos';

import { RefundRequestsService } from '@order/refund-requests/refund-requests.service';
import { RefundRequestRelationType } from '@order/refund-requests/constants';

@SqsProcess(SEND_REFUND_REQUESTED_ALIMTALK_QUEUE)
export class SendRefundRequestedAlimtalkConsumer {
  private REFUND_REQUEST_RELATIONS: Array<RefundRequestRelationType> = [
    'order',
    'orderItems',
    'seller',
    'seller.brand',
    'seller.returnAddress',
    'seller.courier',
    'shipment',
    'shipment.courier',
    'order.buyer',
  ];

  constructor(
    private readonly alimtalkService: AlimtalkService,
    private readonly refundRequestsService: RefundRequestsService
  ) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { merchantUid } = plainToClass(
      SendRefundRequestedAlimtalkMto,
      JSON.parse(message.Body)
    );

    const refundRequest = await this.refundRequestsService.get(
      merchantUid,
      this.REFUND_REQUEST_RELATIONS
    );

    await this.alimtalkService.sendRefundRequested(refundRequest);
  }
}
