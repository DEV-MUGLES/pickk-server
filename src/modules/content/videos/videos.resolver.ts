import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard, JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { VideoSearchService } from '@mcommon/search/video.search.service';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { VideoRelationType, VIDEO_RELATIONS } from './constants';
import { CreateVideoInput, UpdateVideoInput, VideoFilter } from './dtos';
import { Video } from './models';
import { VideosProducer } from './producers';

import { VideosService } from './videos.service';

@Injectable()
export class VideosResolver extends BaseResolver<VideoRelationType> {
  relations = VIDEO_RELATIONS;

  constructor(
    private readonly videosService: VideosService,
    private readonly videosSearchService: VideoSearchService,
    private readonly likesService: LikesService,
    private readonly videosProducer: VideosProducer
  ) {
    super();
  }

  @Query(() => Video)
  @UseGuards(JwtOrNotGuard)
  async video(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Video> {
    return await this.videosService.get(
      id,
      this.getRelationsFromInfo(info),
      payload?.sub
    );
  }

  @Query(() => [Video])
  @UseGuards(JwtOrNotGuard)
  async videos(
    @CurrentUser() payload: JwtPayload,
    @Args('filter', { nullable: true }) filter?: VideoFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Video[]> {
    return await this.videosService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info),
      payload?.sub
    );
  }

  @Query(() => [Video])
  @UseGuards(JwtOrNotGuard)
  async searchVideo(
    @CurrentUser() payload: JwtPayload,
    @Args('query') query: string,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Video[]> {
    const { ids } = await this.videosSearchService.search(query, pageInput);

    return await this.videosService.list(
      { idIn: ids },
      null,
      this.getRelationsFromInfo(info),
      payload?.sub
    );
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

    return await this.videosService.likingListByIds(
      ids,
      this.getRelationsFromInfo(info),
      userId
    );
  }

  @Mutation(() => Video)
  @UseGuards(JwtVerifyGuard)
  async createVideo(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('createVideoInput') input: CreateVideoInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Video> {
    const { id } = await this.videosService.create(userId, input);
    await this.videosProducer.sendVideoCreationSlackMessage(id);
    return await this.videosService.get(id, this.getRelationsFromInfo(info));
  }

  @Mutation(() => Video)
  @UseGuards(JwtVerifyGuard)
  async updateVideo(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number,
    @Args('updateVideoInput') input: UpdateVideoInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Video> {
    await this.videosService.checkBelongsTo(id, userId);

    await this.videosService.update(id, input);
    return await this.videosService.get(id, this.getRelationsFromInfo(info));
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async removeVideo(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number
  ): Promise<boolean> {
    await this.videosService.checkBelongsTo(id, userId);
    await this.videosService.remove(id);
    return true;
  }
}
