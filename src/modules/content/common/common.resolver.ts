import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SlackService } from '@providers/slack';

@Resolver()
export class ContentCommonResolver {
  constructor(private readonly slackService: SlackService) {}

  @Mutation(() => Boolean)
  async reportContent(@Args('url') url: string): Promise<boolean> {
    await this.slackService.sendContentReported(url);
    return true;
  }
}
