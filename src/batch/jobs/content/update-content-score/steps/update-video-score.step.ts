import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentsRepository } from '@content/comments/comments.repository';
import { CommentOwnerType } from '@content/comments/constants';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesRepository } from '@content/likes/likes.repository';
import { VideosRepository } from '@content/videos/videos.repository';

import { VideoHitScore } from '../hit-score';

import { BaseUpdateScoreStep } from './base-update-score.step';

@Injectable()
export class UpdateVideoScoreStep extends BaseUpdateScoreStep {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository,
    @InjectRepository(LikesRepository)
    private readonly likesRepository: LikesRepository,
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository
  ) {
    super();
  }

  async tasklet() {
    const videos = await this.videosRepository.find({
      select: ['id', 'createdAt', 'score', 'hitCount'],
    });

    await this.setLikeDiffMaps();
    await this.setCommentDiffMaps();

    for (const video of videos) {
      const { id, hitCount, createdAt } = video;
      const newScore =
        new VideoHitScore(hitCount, createdAt).value +
        this.calculateTotalReactionScore(id);

      // 스코어가 0.2미만으로 변경되면 변경되지 않도록 함
      const isUpdated =
        Math.floor(video.score * 20) !== Math.floor(newScore * 20);
      if (isUpdated) {
        await this.videosRepository.update(video.id, { score: newScore });
      }
    }
  }

  calculateTotalReactionScore(id: number) {
    return (
      this.calculateLikeReactionScore(id) +
      this.calculateCommentReactionScore(id)
    );
  }

  async setLikeDiffMaps() {
    const likesQueryBuilder = this.likesRepository.createQueryBuilder();
    await this.setFirstIntervalLikeCountDiffMap(
      likesQueryBuilder,
      LikeOwnerType.Video
    );
    await this.setSecondIntervalLikeCountDiffMap(
      likesQueryBuilder,
      LikeOwnerType.Video
    );
  }

  async setCommentDiffMaps() {
    const commentsQueryBuilder = this.commentsRepository.createQueryBuilder();
    await this.setFirstIntervalCommentCountDiffMap(
      commentsQueryBuilder,
      CommentOwnerType.Video
    );
    await this.setSecondIntervalCommentCountDiffMap(
      commentsQueryBuilder,
      CommentOwnerType.Video
    );
  }
}
