import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { GIVE_REWARD_QUEUE } from '@queue/constants';
import { GiveRewardMto } from '@queue/mtos';

import { OrderItemsService } from '@order/order-items/order-items.service';

import { RewardSign } from '../constants';

import { RewardsService } from '../rewards.service';

@SqsProcess(GIVE_REWARD_QUEUE)
export class GiveRewardConsumer {
  constructor(
    private readonly orderItemsService: OrderItemsService,
    private readonly rewardsService: RewardsService
  ) {}

  @SqsMessageHandler()
  async giveReward(message: AWS.SQS.Message) {
    const { merchantUid }: GiveRewardMto = JSON.parse(message.Body);
    const orderItem = await this.orderItemsService.get(merchantUid);

    if (!orderItem.recommenderId) {
      return;
    }

    const existing = await this.rewardsService.checkExist(merchantUid);
    if (existing) {
      return;
    }

    await this.rewardsService.create({
      title:
        `[판매] ${orderItem.itemName} ${orderItem.productVariantName}`.slice(
          0,
          25
        ) + '...',
      sign: RewardSign.Plus,
      amount: orderItem.payAmount / 10,
      userId: orderItem.recommenderId,
      recommendDigestId: orderItem.recommendDigestId,
      orderItemMerchantUid: orderItem.merchantUid,
    });
  }
}
