import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

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
        id: mto.id.toString(),
        body: mto,
      }
    );
  }

  private getQueueNameByOwnerType(ownerType: LikeOwnerType) {
    if (ownerType === LikeOwnerType.Comment) {
      return UPDATE_COMMENT_LIKE_COUNT_QUEUE;
    }
    if (ownerType === LikeOwnerType.Digest) {
      return UPDATE_DIGEST_LIKE_COUNT_QUEUE;
    }
    if (ownerType === LikeOwnerType.Look) {
      return UPDATE_LOOK_LIKE_COUNT_QUEUE;
    }
    if (ownerType === LikeOwnerType.Video) {
      return UPDATE_VIDEO_LIKE_COUNT_QUEUE;
    }
    if (ownerType === LikeOwnerType.Keyword) {
      return UPDATE_KEYWORD_LIKE_COUNT_QUEUE;
    }
  }
}
