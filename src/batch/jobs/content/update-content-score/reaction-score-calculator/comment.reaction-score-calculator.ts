import { CommentsRepository } from '@content/comments/comments.repository';
import { CommentOwnerType } from '@content/comments/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

import {
  getReactionScoreFirstInterval,
  getReactionScoreSecondInterval,
} from '../../helpers';

import { ReactionScoreCalculator } from './reaction-score-calculator';

export class CommentReactionScoreCalculator extends ReactionScoreCalculator {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository
  ) {
    super();
    this.weight = 0.025;
  }

  async getDiffs(ownerId: number, ownerType: CommentOwnerType) {
    const [firstIntervalStart, firstIntervalEnd] =
      getReactionScoreFirstInterval();
    const [secondIntervalStart, secondIntervalEnd] =
      getReactionScoreSecondInterval();

    const firstCommentDiff = await this.commentsRepository.count({
      where: {
        ownerType,
        ownerId,
        createdAt: Between(firstIntervalStart, firstIntervalEnd),
      },
    });

    const secondCommentDiff = await this.commentsRepository.count({
      where: {
        ownerType,
        ownerId,
        createdAt: Between(secondIntervalStart, secondIntervalEnd),
      },
    });

    return [firstCommentDiff, secondCommentDiff];
  }
}
