import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { allSettled } from '@common/helpers';

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

    await allSettled(
      videos.map(
        (video) =>
          new Promise(async (resolve, reject) => {
            try {
              const { id, hitCount, createdAt } = video;
              const reactionScore = this.calculateReactionScore(id);
              const hitScore = new VideoHitScore(hitCount, createdAt).value;

              video.score = hitScore + reactionScore;
              resolve(video);
            } catch (err) {
              reject(err);
            }
          })
      )
    );
    await this.videosRepository.save(videos);
  }

  calculateReactionScore(id: number) {
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
