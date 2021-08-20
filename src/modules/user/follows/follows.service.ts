import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Follow } from './models';

import { FollowsRepository } from './follows.repository';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(FollowsRepository)
    private readonly followsRepository: FollowsRepository
  ) {}

  // @TODO: count 업데이트 태스크
  async add(userId: number, targetId: number): Promise<void> {
    if (userId === targetId) {
      throw new ForbiddenException('자신을 팔로우할 수 없습니다!');
    }
    if (await this.followsRepository.checkExist(userId, targetId)) {
      throw new ConflictException('이미 팔로우 했습니다.');
    }

    await this.followsRepository.save(new Follow({ userId, targetId }));
  }

  // @TODO: count 업데이트 태스크
  async remove(userId: number, targetId: number): Promise<void> {
    const likes = await this.followsRepository.find({
      where: { userId, targetId },
    });
    if (likes.length === 0) {
      throw new NotFoundException('취소할 팔로우가 존재하지 않습니다.');
    }

    await this.followsRepository.remove(likes);
  }

  async count(targetId: number): Promise<number> {
    return await this.followsRepository.count({
      where: { targetId },
    });
  }
}
