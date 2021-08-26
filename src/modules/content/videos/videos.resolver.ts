import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { VideoSearchService } from '@mcommon/search/video.search.service';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { VideoRelationType, VIDEO_RELATIONS } from './constants';
import { VideoFilter } from './dtos';
import { Video } from './models';

import { VideosService } from './videos.service';

@Injectable()
export class VideosResolver extends BaseResolver<VideoRelationType> {
  relations = VIDEO_RELATIONS;

  constructor(
    private readonly videosService: VideosService,
    private readonly videosSearchService: VideoSearchService,
    private readonly likesService: LikesService
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

  @Query(() => [Video])
  @UseGuards(JwtVerifyGuard)
  async likingVideos(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('pageInput') pageInput: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Video[]> {
    const ids = await this.likesService.findOwnerIds(
      userId,
      LikeOwnerType.Video,
      pageInput
    );

    return await this.videosService.list(
      { idIn: ids },
      null,
      this.getRelationsFromInfo(info)
    );
  }
}
