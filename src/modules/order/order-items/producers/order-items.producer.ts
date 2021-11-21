import { Injectable } from '@nestjs/common';
import { SqsService } from '@nestjs-packages/sqs';

import { getRandomUuid } from '@common/helpers';
import {
  DELETE_ORDER_ITEMS_INDEX_QUEUE,
  GIVE_REWARD_QUEUE,
  INDEX_ORDER_ITEMS_QUEUE,
} from '@queue/constants';
import {
  DeleteOrderItemsIndexMto,
  GiveRewardMto,
  IndexOrderItemsMto,
} from '@queue/mtos';

@Injectable()
export class OrderItemsProducer {
  constructor(private readonly sqsService: SqsService) {}

  async giveReward(merchantUid: string) {
    await this.sqsService.send<GiveRewardMto>(GIVE_REWARD_QUEUE, {
      id: getRandomUuid(),
      body: { merchantUid },
    });
  }

  async indexOrderItems(merchantUids: string[]) {
    await this.sqsService.send<IndexOrderItemsMto>(INDEX_ORDER_ITEMS_QUEUE, {
      id: getRandomUuid(),
      body: { merchantUids },
    });
  }

  async deleteOrderItemsIndex(merchantUids: string[]) {
    await this.sqsService.send<DeleteOrderItemsIndexMto>(
      DELETE_ORDER_ITEMS_INDEX_QUEUE,
      {
        id: getRandomUuid(),
        body: { merchantUids },
      }
    );
  }
}
