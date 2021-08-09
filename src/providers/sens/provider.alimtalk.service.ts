import { Inject, Injectable } from '@nestjs/common';
import { AlimtalkClient } from 'nest-sens';

import { RefundRequestedTemplate } from '@templates/alimtalk';

import { RefundRequest } from '@order/refund-requests/models';

@Injectable()
export class AlimtalkService {
  constructor(
    @Inject(AlimtalkClient) private readonly alimtalkClient: AlimtalkClient
  ) {}

  async sendRefundRequested(refundRequest: RefundRequest) {
    await this.alimtalkClient.send(
      RefundRequestedTemplate.toRequest(refundRequest)
    );
  }
}
