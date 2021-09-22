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

    await Promise.all(
      videos.map(
        (video) =>
          new Promise((resolve) => {
            const { id, hitCount, createdAt } = video;
            const reactionScore = this.calculateTotalReactionScore(id);
            const hitScore = new VideoHitScore(hitCount, createdAt).value;

            video.score = hitScore + reactionScore;
            resolve(video);
          })
      )
    );
    await this.videosRepository.save(videos);
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
      LikeOwnerType.VIDEO
    );
    await this.setSecondIntervalLikeCountDiffMap(
      likesQueryBuilder,
      LikeOwnerType.VIDEO
    );
  }

  async setCommentDiffMaps() {
    const commentsQueryBuilder = this.commentsRepository.createQueryBuilder();
    await this.setFirstIntervalCommentCountDiffMap(
      commentsQueryBuilder,
      CommentOwnerType.VIDEO
    );
    await this.setSecondIntervalCommentCountDiffMap(
      commentsQueryBuilder,
      CommentOwnerType.VIDEO
    );
  }
}
