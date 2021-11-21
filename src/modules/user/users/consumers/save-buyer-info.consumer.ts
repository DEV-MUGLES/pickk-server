import { Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { BaseConsumer } from '@common/base.consumer';
import { SAVE_BUYER_INFO_QUEUE } from '@queue/constants';
import { SaveBuyerInfoMto } from '@queue/mtos';

import { UsersService } from '../users.service';

@SqsProcess(SAVE_BUYER_INFO_QUEUE)
export class SaveBuyerInfoConsumer extends BaseConsumer {
  constructor(
    private readonly usersService: UsersService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async saveBuyerInfo(message: AWS.SQS.Message) {
    const { userId, buyerInput }: SaveBuyerInfoMto = JSON.parse(message.Body);

    const user = await this.usersService.get(userId);

    await this.usersService.update(userId, {
      name: user.name || buyerInput.name,
      email: user.email || buyerInput.email,
      phoneNumber: user.phoneNumber || buyerInput.phoneNumber,
    });
  }
}
