import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesRepository } from '@content/likes/likes.repository';

import {
  getReactionScoreFirstInterval,
  getReactionScoreSecondInterval,
} from '../../helpers';

import { ReactionScoreCalculator } from './reaction-score-calculator';

@Injectable()
export class LikeReactionScoreCalculator extends ReactionScoreCalculator {
  constructor(
    @InjectRepository(LikesRepository)
    private readonly likesRepository: LikesRepository
  ) {
    super();
    this.weight = 0.05;
  }

  async getDiffs(ownerId: number, ownerType: LikeOwnerType) {
    const [firstIntervalStart, firstIntervalEnd] =
      getReactionScoreFirstInterval();
    const [secondIntervalStart, secondIntervalEnd] =
      getReactionScoreSecondInterval();

    const firstLikeDiff = await this.likesRepository.count({
      where: {
        ownerType,
        ownerId,
        createdAt: Between(firstIntervalStart, firstIntervalEnd),
      },
    });

    const secondLikeDiff = await this.likesRepository.count({
      where: {
        ownerType,
        ownerId,
        createdAt: Between(secondIntervalStart, secondIntervalEnd),
      },
    });

    return [firstLikeDiff, secondLikeDiff];
  }
}
