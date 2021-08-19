import { DynamicModule, Provider } from '@nestjs/common';
import { IncomingWebhook } from '@slack/webhook';

import { SlackModuleAsyncOptions, SlackModuleOptions } from './interfaces';

export class SlackModule {
  public static forRoot(options: SlackModuleOptions): DynamicModule {
    const webhookProvider: Provider = {
      provide: IncomingWebhook,
      useValue: new IncomingWebhook(options.url, options.defaults),
    };

    return {
      exports: [webhookProvider],
      module: SlackModule,
      providers: [webhookProvider],
    };
  }

  public static forRootAsync(
    asyncOptions: SlackModuleAsyncOptions
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
      module: SlackModule,
      providers: [webhookProvider],
    };
  }
}
