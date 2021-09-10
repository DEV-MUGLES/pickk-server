import { Type } from 'class-transformer';

import { RefundRequest } from '@order/refund-requests/models';

export class SendRefundRequestedAlimtalkMto {
  @Type(() => RefundRequest)
  refundRequest: RefundRequest;
}
