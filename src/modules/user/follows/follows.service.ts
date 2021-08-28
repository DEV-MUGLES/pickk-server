import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Follow } from './models';
import { FollowProducer } from './producers';

import { FollowsRepository } from './follows.repository';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(FollowsRepository)
    private readonly followsRepository: FollowsRepository,
    private readonly followProducer: FollowProducer
  ) {}

  async check(userId: number, targetId: number): Promise<boolean> {
    return await this.followsRepository.checkExist(userId, targetId);
  }

  async bulkCheck(
    userId: number,
    targetIds: number[]
  ): Promise<Map<number, boolean>> {
    return await this.followsRepository.bulkCheckExist(userId, targetIds);
  }

  async enrichFollowing<
    TargetUser extends { id: number; isFollowing: boolean }
  >(userId: number, target: TargetUser): Promise<void> {
    if (!userId || !target?.id) {
      return;
    }

    target.isFollowing = await this.check(userId, target.id);
  }

  async enrichAuthorFollowing<
    T extends { id: number; userId: number; user?: { isFollowing: boolean } }
  >(userId: number, owner: T): Promise<void> {
    if (!userId || !owner?.user) {
      return;
    }

    owner.user.isFollowing = await this.check(userId, owner.userId);
  }

  async bulkEnrichAuthorFollowing<
    T extends { id: number; userId: number; user?: { isFollowing: boolean } }
  >(userId: number, owners: T[]): Promise<void> {
    if (!userId || !owners.some((owner) => !!owner.user)) {
      return;
    }

    const followExistMap = await this.bulkCheck(
      userId,
      owners.map((owner) => owner.userId)
    );

    for (const owner of owners) {
      if (owner.user) {
        owner.user.isFollowing = followExistMap.get(owner.userId);
      }
    }
  }

  async add(userId: number, targetId: number): Promise<void> {
    if (userId === targetId) {
      throw new ForbiddenException('자신을 팔로우할 수 없습니다!');
    }
    if (await this.check(userId, targetId)) {
      throw new ConflictException('이미 팔로우 했습니다.');
    }

    await this.followsRepository.save(new Follow({ userId, targetId }));
    await this.produceUpdateUserFollowCount(targetId);
  }

  async remove(userId: number, targetId: number): Promise<void> {
    const likes = await this.followsRepository.find({
      where: { userId, targetId },
    });
    if (likes.length === 0) {
      throw new NotFoundException('취소할 팔로우가 존재하지 않습니다.');
    }

    await this.followsRepository.remove(likes);
    await this.produceUpdateUserFollowCount(targetId);
  }

  async count(targetId: number): Promise<number> {
    return await this.followsRepository.count({
      where: { targetId },
    });
  }

  async produceUpdateUserFollowCount(targetId: number) {
    await this.followProducer.updateUserFollowCount({ id: targetId });
  }

  async getFollowingUserIds(userId: number) {
    const follows = await this.followsRepository.find({
      select: ['targetId'],
      where: { userId },
    });

    return follows.map((follow) => follow.targetId);
  }
}
