import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { bulkEnrichUserIsMe, enrichIsMine, parseFilter } from '@common/helpers';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { ItemPropertiesService } from '@item/item-properties/item-properties.service';
import { FollowsService } from '@user/follows/follows.service';

import { VideoRelationType } from './constants';
import { CreateVideoInput, VideoFilter } from './dtos';
import { VideoFactory } from './factories';
import { Video } from './models';

import { VideosRepository } from './videos.repository';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository,
    private readonly likesService: LikesService,
    private readonly followsService: FollowsService,
    private readonly itemPropertiesService: ItemPropertiesService
  ) {}

  async get(id: number, relations: VideoRelationType[] = [], userId?: number) {
    const video = await this.videosRepository.get(id, relations);

    if (userId) {
      enrichIsMine(userId, video);
      await this.likesService.enrichLiking(userId, LikeOwnerType.Video, video);
      await this.followsService.enrichAuthorFollowing(userId, video);
    }

    return video;
  }

  async list(
    filter?: VideoFilter,
    pageInput?: PageInput,
    relations: VideoRelationType[] = [],
    userId?: number
  ): Promise<Video[]> {
    const _filter = plainToClass(VideoFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    const videos = this.videosRepository.entityToModelMany(
      await this.videosRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
        order: {
          [filter?.orderBy ?? 'id']: 'DESC',
        },
      })
    );

    await this.likesService.bulkEnrichLiking(
      userId,
      LikeOwnerType.Video,
      videos
    );
    await this.followsService.bulkEnrichAuthorFollowing(userId, videos);
    bulkEnrichUserIsMe(userId, videos);

    return videos;
  }

  async create(userId: number, input: CreateVideoInput): Promise<Video> {
    const itemPropertyValues = await this.itemPropertiesService.findValuesByIds(
      input.digests.reduce(
        (acc, digest) => [...acc, ...digest.itemPropertyValueIds],
        []
      )
    );

    const video = VideoFactory.from(userId, input, itemPropertyValues);
    return await this.videosRepository.save(video);
  }
}
