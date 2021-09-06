import dayjs from 'dayjs';
import { SelectQueryBuilder } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { LikeOwnerType } from '@content/likes/constants';
import { LikeEntity } from '@content/likes/entities';
import { CommentOwnerType } from '@content/comments/constants';
import { CommentEntity } from '@content/comments/entities';

import { LikeCountDiffMap, CommentCountDiffMap } from '../count-diff-map';
import { calculateReactionScore, ReactionScoreWeight } from '../../helpers';

const FIRST_INTERVAL_START_HOUR = 168;
const FIRST_INTERVAL_END_HOUR = 0;
const SECOND_INTERVAL_START_HOUR = 600;
const SECOND_INTERVAL_END_HOUR = 169;

export abstract class BaseUpdateScoreStep extends BaseStep {
  private firstIntervalLikeCountDiffMap: LikeCountDiffMap;
  private secondIntervalLikeCountDiffMap: LikeCountDiffMap;
  private firstIntervalCommentCountDiffMap: CommentCountDiffMap;
  private secondIntervalCommentCountDiffMap: CommentCountDiffMap;

  get firstInterval(): [Date, Date] {
    return [
      dayjs().subtract(FIRST_INTERVAL_START_HOUR, 'hour').toDate(),
      dayjs().subtract(FIRST_INTERVAL_END_HOUR, 'hour').toDate(),
    ];
  }

  get secondInterval(): [Date, Date] {
    return [
      dayjs().subtract(SECOND_INTERVAL_START_HOUR, 'hour').toDate(),
      dayjs().subtract(SECOND_INTERVAL_END_HOUR, 'hour').toDate(),
    ];
  }

  protected calculateLikeReactionScore(id: number) {
    const likeDiffs = [
      this.firstIntervalLikeCountDiffMap.get(id),
      this.secondIntervalLikeCountDiffMap.get(id),
    ];
    return calculateReactionScore(likeDiffs, ReactionScoreWeight.Like);
  }

  protected calculateCommentReactionScore(id: number) {
    const commentDiffs = [
      this.firstIntervalCommentCountDiffMap.get(id),
      this.secondIntervalCommentCountDiffMap.get(id),
    ];
    return calculateReactionScore(commentDiffs, ReactionScoreWeight.Comment);
  }

  protected async setFirstIntervalLikeCountDiffMap(
    builder: SelectQueryBuilder<LikeEntity>,
    type: LikeOwnerType
  ) {
    this.firstIntervalLikeCountDiffMap = await LikeCountDiffMap.create(
      builder,
      type,
      this.firstInterval
    );
  }

  protected async setSecondIntervalLikeCountDiffMap(
    builder: SelectQueryBuilder<LikeEntity>,
    type: LikeOwnerType
  ) {
    this.secondIntervalLikeCountDiffMap = await LikeCountDiffMap.create(
      builder,
      type,
      this.secondInterval
    );
  }

  protected async setFirstIntervalCommentCountDiffMap(
    builder: SelectQueryBuilder<CommentEntity>,
    type: CommentOwnerType
  ) {
    this.firstIntervalCommentCountDiffMap = await CommentCountDiffMap.create(
      builder,
      type,
      this.firstInterval
    );
  }

  protected async setSecondIntervalCommentCountDiffMap(
    builder: SelectQueryBuilder<CommentEntity>,
    type: CommentOwnerType
  ) {
    this.secondIntervalCommentCountDiffMap = await CommentCountDiffMap.create(
      builder,
      type,
      this.secondInterval
    );
  }
}
