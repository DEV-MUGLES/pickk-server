import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import {
  UPDATE_DIGEST_COMMENT_COUNT_QUEUE,
  UPDATE_LOOK_COMMENT_COUNT_QUEUE,
  UPDATE_VIDEO_COMMENT_COUNT_QUEUE,
} from '@queue/constants';
import { UpdateCommentCountMto } from '@queue/mtos';

import { CommentOwnerType } from '../constants';

@Injectable()
export class CommentsProducer {
  constructor(private readonly sqsService: SqsService) {}

  async updateOwnerCommentCount(ownerId: number, ownerType: CommentOwnerType) {
    await this.sqsService.send<UpdateCommentCountMto>(
      this.getQueueNameByOwnerType(ownerType),
      {
        id: getRandomUuid(),
        body: { id: ownerId },
      }
    );
  }

  private getQueueNameByOwnerType(ownerType: CommentOwnerType) {
    if (ownerType === CommentOwnerType.DIGEST) {
      return UPDATE_DIGEST_COMMENT_COUNT_QUEUE;
    }
    if (ownerType === CommentOwnerType.LOOK) {
      return UPDATE_LOOK_COMMENT_COUNT_QUEUE;
    }
    if (ownerType === CommentOwnerType.VIDEO) {
      return UPDATE_VIDEO_COMMENT_COUNT_QUEUE;
    }
  }
}
