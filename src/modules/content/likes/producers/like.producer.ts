import { Inject, Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import {
  UPDATE_COMMENT_LIKE_COUNT_QUEUE,
  UPDATE_DIGEST_LIKE_COUNT_QUEUE,
  UPDATE_LOOK_LIKE_COUNT_QUEUE,
  UPDATE_VIDEO_LIKE_COUNT_QUEUE,
} from '@src/queue/constants';
import { UpdateLikeCountMto } from '@src/queue/mtos';

@Injectable()
export class LikeProducer {
  constructor(@Inject(SqsService) private readonly sqsService: SqsService) {}

  async updateCommentLikeCount(mto: UpdateLikeCountMto) {
    await this.sqsService.send<UpdateLikeCountMto>(
      UPDATE_COMMENT_LIKE_COUNT_QUEUE,
      {
        id: mto.id.toString(),
        body: mto,
      }
    );
  }

  async updateDigestLikeCount(mto: UpdateLikeCountMto) {
    await this.sqsService.send<UpdateLikeCountMto>(
      UPDATE_DIGEST_LIKE_COUNT_QUEUE,
      {
        id: mto.id.toString(),
        body: mto,
      }
    );
  }

  async updateLookLikeCount(mto: UpdateLikeCountMto) {
    await this.sqsService.send<UpdateLikeCountMto>(
      UPDATE_LOOK_LIKE_COUNT_QUEUE,
      {
        id: mto.id.toString(),
        body: mto,
      }
    );
  }

  async updateVideoLikeCount(mto: UpdateLikeCountMto) {
    await this.sqsService.send<UpdateLikeCountMto>(
      UPDATE_VIDEO_LIKE_COUNT_QUEUE,
      {
        id: mto.id.toString(),
        body: mto,
      }
    );
  }
}
