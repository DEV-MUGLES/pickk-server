import { Module } from '@nestjs/common';
import { SensModule, SensModuleAsyncOptions } from 'nest-sens';

import { SensConfigModule } from '@src/config/providers/sens/config.module';
import { SensConfigService } from '@src/config/providers/sens/config.service';

@Module({
  imports: [
    SensModule.forRootAsync({
      imports: [SensConfigModule],
      useFactory: async (sensConfigService: SensConfigService) => ({
        accessKey: sensConfigService.ncloudAccessKey,
        secretKey: sensConfigService.ncloudSecretKey,
        sms: {
          smsServiceId: sensConfigService.ncloudSmsServiceId,
          smsSecretKey: sensConfigService.ncloudSmsSecretKey,
          callingNumber: sensConfigService.ncloudSmsCallingNumber,
        },
        alimtalk: {
          alimtalkServiceId: sensConfigService.ncloudAlimtalkServiceId,
          plusFriendId: sensConfigService.plusFriendId,
        },
      }),
      inject: [SensConfigService],
    } as SensModuleAsyncOptions),
  ],
})
export class SensProviderModule {}
