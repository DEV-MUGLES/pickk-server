import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserAppInstallLog } from './models';

import { UserAppInstallLogsRepository } from './user-logs.repository';

@Injectable()
export class UserLogsService {
  constructor(
    @InjectRepository(UserAppInstallLogsRepository)
    private readonly userAppInstallLogsRepository: UserAppInstallLogsRepository
  ) {}

  async checkAppInstalled(userId: number): Promise<boolean> {
    const appInstallLog = await this.userAppInstallLogsRepository.findOne({
      userId,
    });

    return appInstallLog != null;
  }

  async createAppInstallLog(userId: number): Promise<void> {
    const isInstalled = await this.checkAppInstalled(userId);
    if (isInstalled) {
      throw new BadRequestException('이미 앱 설치보상을 수령하셨습니다.');
    }

    await this.userAppInstallLogsRepository.save(
      new UserAppInstallLog({ userId })
    );
  }
}
