import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { MoreThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { allSettled } from '@common/helpers';

import { LikesRepository } from '@content/likes/likes.repository';
import { LikeOwnerType } from '@content/likes/constants';
import { CommentsRepository } from '@content/comments/comments.repository';
import { CommentOwnerType } from '@content/comments/constants';
import { VideosRepository } from '@content/videos/videos.repository';

import { calculateHitScore, calculateLikeCommentScore } from '../../helpers';
import { UpdateContentScoreType } from '../../constants';

@Injectable()
export class UpdateVideoScoreStep extends BaseStep {
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
      select: ['id', 'createdAt', 'score', 'hitCount', 'likeCommentScore'],
    });

    await allSettled(
      videos.map(
        (video) =>
          new Promise(async (resolve, reject) => {
            try {
              const { id, hitCount, createdAt, likeCommentScore } = video;

              const hitScore = calculateHitScore(
                hitCount,
                createdAt,
                UpdateContentScoreType.Video
              );
              const newLikeCommentScore =
                await this.getNewLikeCommentOrderScore(id, likeCommentScore);

              video.score = hitScore + newLikeCommentScore;
              video.likeCommentScore = newLikeCommentScore;
              resolve(video);
            } catch (err) {
              reject(err);
            }
          })
      )
    );
    await this.videosRepository.save(videos);
  }

  async getNewLikeCommentOrderScore(id: number, likeCommentScore: number) {
    const daliyLikeCount = await this.likesRepository.count({
      where: {
        ownerType: LikeOwnerType.Video,
        ownerId: id,
        createdAt: MoreThan(dayjs().add(-1, 'day').toDate()),
      },
    });

    const daliyCommentCount = await this.commentsRepository.count({
      where: {
        ownerType: CommentOwnerType.Video,
        ownerId: id,
        createdAt: MoreThan(dayjs().add(-1, 'day').toDate()),
      },
    });

    return calculateLikeCommentScore(
      daliyLikeCount,
      daliyCommentCount,
      likeCommentScore
    );
  }
}
