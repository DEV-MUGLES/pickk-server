import { Inject, Injectable } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { VideoRelationType, VIDEO_RELATIONS } from './constants';
import { VideoFilter } from './dtos';
import { Video } from './models';

import { VideosService } from './videos.service';

@Injectable()
export class VideosResolver extends BaseResolver<VideoRelationType> {
  relations = VIDEO_RELATIONS;

  constructor(
    @Inject(VideosService) private readonly videosService: VideosService
  ) {
    super();
  }

  @Query(() => [Video])
  async videos(
    @Args('filter', { nullable: true }) filter?: VideoFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Video[]> {
    return await this.videosService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }
}
