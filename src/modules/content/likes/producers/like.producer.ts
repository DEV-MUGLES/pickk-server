import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import {
  UPDATE_COMMENT_LIKE_COUNT_QUEUE,
  UPDATE_DIGEST_LIKE_COUNT_QUEUE,
  UPDATE_KEYWORD_LIKE_COUNT_QUEUE,
  UPDATE_LOOK_LIKE_COUNT_QUEUE,
  UPDATE_VIDEO_LIKE_COUNT_QUEUE,
} from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { LikeOwnerType } from '../constants';

@Injectable()
export class LikeProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async updateOwnerLikeCount(
    ownerType: LikeOwnerType,
    mto: UpdateLikeCountMto
  ) {
    await this.sqsService.send<UpdateLikeCountMto>(
      this.getQueueNameByOwnerType(ownerType),
      {
        id: getRandomUuid(),
        body: mto,
      }
    );
  }

  private getQueueNameByOwnerType(ownerType: LikeOwnerType) {
    if (ownerType === LikeOwnerType.COMMENT) {
      return UPDATE_COMMENT_LIKE_COUNT_QUEUE;
    }
    if (ownerType === LikeOwnerType.DIGEST) {
      return UPDATE_DIGEST_LIKE_COUNT_QUEUE;
    }
    if (ownerType === LikeOwnerType.LOOK) {
      return UPDATE_LOOK_LIKE_COUNT_QUEUE;
    }
    if (ownerType === LikeOwnerType.VIDEO) {
      return UPDATE_VIDEO_LIKE_COUNT_QUEUE;
    }
    if (ownerType === LikeOwnerType.KEYWORD) {
      return UPDATE_KEYWORD_LIKE_COUNT_QUEUE;
    }
  }
}
