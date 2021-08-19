import { ModuleMetadata } from '@nestjs/common';
import { IncomingWebhookDefaultArguments } from '@slack/webhook';

export interface SlackModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => SlackModuleOptions | Promise<SlackModuleOptions>;
  inject?: any[];
}

export type SlackModuleOptions = {
  url: string;
  defaults?: IncomingWebhookDefaultArguments;
};
