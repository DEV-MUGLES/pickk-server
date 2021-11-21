import { Global, Module } from '@nestjs/common';
import {
  SensModule,
  SensModuleAsyncOptions,
  SensModuleOptions,
} from '@nestjs-packages/ncp-sens';

import { SensConfigModule, SensConfigService } from '@config/providers/sens';

import { AlimtalkService } from './provider.alimtalk.service';
import { SmsService } from './provider.sms.service';

@Global()
@Module({
  imports: [
    SensModule.forRootAsync({
      imports: [SensConfigModule],
      useFactory: async (sensConfigService: SensConfigService) =>
        ({
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
        } as SensModuleOptions),
      inject: [SensConfigService],
    } as SensModuleAsyncOptions),
  ],
  providers: [AlimtalkService, SmsService],
  exports: [AlimtalkService, SmsService],
})
export class SensProviderModule {}
