import { DynamicModule, Provider } from '@nestjs/common';
import { IncomingWebhook } from '@slack/webhook';

import {
  SlackWebhookModuleAsyncOptions,
  SlackWebhookModuleOptions,
} from './interfaces';

export class SlackWebhookModule {
  public static forRoot(options: SlackWebhookModuleOptions): DynamicModule {
    const webhookProvider: Provider = {
      provide: IncomingWebhook,
      useValue: new IncomingWebhook(options.url, options.defaults),
    };

    return {
      exports: [webhookProvider],
      module: SlackWebhookModule,
      providers: [webhookProvider],
    };
  }

  public static forRootAsync(
    asyncOptions: SlackWebhookModuleAsyncOptions
  ): DynamicModule {
    const webhookProvider: Provider = {
      provide: IncomingWebhook,
      useFactory: async (...args) => {
        const { url, defaults } = await asyncOptions.useFactory(...args);
        return new IncomingWebhook(url, defaults);
      },
      inject: asyncOptions.inject || [],
    };

    return {
      imports: asyncOptions.imports,
      exports: [webhookProvider],
      module: SlackWebhookModule,
      providers: [webhookProvider],
    };
  }
}
