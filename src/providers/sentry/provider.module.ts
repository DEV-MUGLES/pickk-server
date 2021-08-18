import { Module } from '@nestjs/common';
import { SentryModule } from '@ntegral/nestjs-sentry';

import {
  SentryConfigModule,
  SentryConfigService,
} from '@config/providers/sentry';

@Module({
  imports: [
    SentryModule.forRootAsync({
      imports: [SentryConfigModule],
      useFactory: async (sentryConfigService: SentryConfigService) => ({
        dsn: sentryConfigService.dsn,
        debug: true,
        environment: sentryConfigService.environment,
        tracesSampleRate: 1.0,
      }),
      inject: [SentryConfigService],
    }),
  ],
})
export class SentryProviderModule {}
