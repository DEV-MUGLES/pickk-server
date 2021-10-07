import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import { GIVE_REWARD_QUEUE } from '@queue/constants';
import { GiveRewardMto } from '@queue/mtos';

@Injectable()
export class OrderItemsProducer {
  constructor(private readonly sqsService: SqsService) {}

  async giveReward(merchantUid: string) {
    await this.sqsService.send<GiveRewardMto>(GIVE_REWARD_QUEUE, {
      id: getRandomUuid(),
      body: { merchantUid },
    });
  }
}
