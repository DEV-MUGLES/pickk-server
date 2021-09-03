import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { allSettled } from '@common/helpers';

import { LikeOwnerType } from '@content/likes/constants';
import { CommentOwnerType } from '@content/comments/constants';
import { VideosRepository } from '@content/videos/videos.repository';

import { calculateHitScore } from '../../helpers';
import { UpdateContentScoreType } from '../../constants';
import { CommentReactionScoreCalculator } from '../reaction-score-calculator/comment.reaction-score-calculator';
import { LikeReactionScoreCalculator } from '../reaction-score-calculator/like.reaction-score-calculator';

@Injectable()
export class UpdateVideoScoreStep extends BaseStep {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository,
    private readonly likeReactionScoreCalculator: LikeReactionScoreCalculator,
    private readonly commentReactionScoreCalculator: CommentReactionScoreCalculator
  ) {
    super();
  }

  async tasklet() {
    const videos = await this.videosRepository.find({
      select: ['id', 'createdAt', 'score', 'hitCount'],
    });

    await allSettled(
      videos.map(
        (video) =>
          new Promise(async (resolve, reject) => {
            try {
              const { id, hitCount, createdAt } = video;

              const hitScore = calculateHitScore(
                hitCount,
                createdAt,
                UpdateContentScoreType.Video
              );

              const reactionScore = await this.calculateReactionScore(id);

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

  async calculateReactionScore(id: number) {
    return (
      (await this.likeReactionScoreCalculator.calculateScore(
        id,
        LikeOwnerType.Video
      )) +
      (await this.commentReactionScoreCalculator.calculateScore(
        id,
        CommentOwnerType.Video
      ))
    );
  }
}
