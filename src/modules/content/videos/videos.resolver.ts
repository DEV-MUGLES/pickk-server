import { Injectable } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { VideoSearchService } from '@mcommon/search/video.search.service';

import { VideoRelationType, VIDEO_RELATIONS } from './constants';
import { VideoFilter } from './dtos';
import { Video } from './models';

import { VideosService } from './videos.service';

@Injectable()
export class VideosResolver extends BaseResolver<VideoRelationType> {
  relations = VIDEO_RELATIONS;

  constructor(
    private readonly videosService: VideosService,
    private readonly videosSearchService: VideoSearchService
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

  @Query(() => [Video])
  async searchVideo(
    @Args('query') query: string,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Video[]> {
    const ids = await this.videosSearchService.search(query, pageInput);

    return await this.videosService.list(
      { idIn: ids },
      null,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => Boolean)
  async indexVideo() {
    await this.videosSearchService.index(1);
    await this.videosSearchService.index(2);
  }
}
