import {
  SlackWebhookConfigModule,
  SlackWebhookConfigService,
} from '@config/providers/slack-webhook';
import { Global, Module } from '@nestjs/common';

import { SlackWebhookService } from './provider.service';
import { SlackWebhookModule } from './slack-webhook.module';

@Global()
@Module({
  imports: [
    SlackWebhookModule.forRootAsync({
      imports: [SlackWebhookConfigModule],
      useFactory: (configService: SlackWebhookConfigService) => ({
        url: configService.url,
      }),
      inject: [SlackWebhookConfigService],
    }),
  ],
  providers: [SlackWebhookService],
  exports: [SlackWebhookService],
})
export class SlackWebhookProviderModule {}
