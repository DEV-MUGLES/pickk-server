import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import { UPDATE_USER_FOLLOW_COUNT_QUEUE } from '@queue/constants';
import { UpdateUserFollowCountMto } from '@queue/mtos';

@Injectable()
export class FollowProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async updateUserFollowCount(mto: UpdateUserFollowCountMto) {
    await this.sqsService.send<UpdateUserFollowCountMto>(
      UPDATE_USER_FOLLOW_COUNT_QUEUE,
      {
        id: getRandomUuid(),
        body: mto,
      }
    );
  }
}
