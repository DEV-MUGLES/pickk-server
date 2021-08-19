import { Global, Module } from '@nestjs/common';

import { SlackConfigModule, SlackConfigService } from '@config/providers/slack';

import { SlackService } from './provider.service';
import { SlackModule } from './slack.module';

@Global()
@Module({
  imports: [
    SlackModule.forRootAsync({
      imports: [SlackConfigModule],
      useFactory: (configService: SlackConfigService) => ({
        url: configService.webhookUrl,
      }),
      inject: [SlackConfigService],
    }),
  ],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackProviderModule {}
