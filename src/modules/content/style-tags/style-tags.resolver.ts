import { Injectable } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { StyleTag } from './models';
import { StyleTagsService } from './style-tags.service';

@Injectable()
export class StyleTagsResolver {
  constructor(private readonly styleTagsService: StyleTagsService) {}

  @Query(() => [StyleTag])
  async styleTags(): Promise<StyleTag[]> {
    return await this.styleTagsService.list();
  }
}
