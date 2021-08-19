import { ModuleMetadata } from '@nestjs/common';
import { IncomingWebhookDefaultArguments } from '@slack/webhook';

export interface SlackWebhookModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => SlackWebhookModuleOptions | Promise<SlackWebhookModuleOptions>;
  inject?: any[];
}

export type SlackWebhookModuleOptions = {
  url: string;
  defaults?: IncomingWebhookDefaultArguments;
};
