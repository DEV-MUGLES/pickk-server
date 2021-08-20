import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { UPDATE_COMMENT_LIKE_COUNT_QUEUE } from '@queue/constants';
import { UpdateLikeCountMto } from '@queue/mtos';

import { CommentsService } from '../comments.service';

@SqsProcess(UPDATE_COMMENT_LIKE_COUNT_QUEUE)
export class UpdateCommentLikeCountConsumer {
  constructor(private readonly commentsService: CommentsService) {}

  @SqsMessageHandler(true)
  async updateLikeCount(messages: AWS.SQS.Message[]) {
    const mtos: UpdateLikeCountMto[] = messages.map((m) => JSON.parse(m.Body));

    const mtoIdSet = new Set(mtos.map((m) => m.id));
    const updateLikeCountParams = Array.from(mtoIdSet).map((id) => {
      const totalDiff = mtos
        .filter((m) => m.id === id)
        .reduce((acc, mto) => acc + mto.diff, 0);
      return {
        id,
        diff: totalDiff,
      };
    });

    for (const updateLikeCountParam of updateLikeCountParams) {
      const { id, diff } = updateLikeCountParam;
      await this.commentsService.updateLikeCount(id, diff);
    }
  }
}
