import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import {
  bulkEnrichUserIsMe,
  enrichIsMine,
  findModelById,
  findModelsByIds,
  parseFilter,
} from '@common/helpers';

import { DigestFactory } from '@content/digests/factories';
import { Digest } from '@content/digests/models';
import { DigestsProducer } from '@content/digests/producers';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { ItemPropertiesService } from '@item/item-properties/item-properties.service';
import { FollowsService } from '@user/follows/follows.service';

import { VideoRelationType } from './constants';
import { CreateVideoInput, UpdateVideoInput, VideoFilter } from './dtos';
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
    private readonly itemPropertiesService: ItemPropertiesService,
    private readonly digestsProducer: DigestsProducer
  ) {}

  async checkBelongsTo(id: number, userId: number): Promise<void> {
    const isMine = await this.videosRepository.checkBelongsTo(id, userId);
    if (!isMine) {
      throw new ForbiddenException('자신의 게시물이 아닙니다.');
    }
  }

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
    const itemPropertyValueIds = input.digests.reduce(
      (acc, digest) => [...acc, ...digest.itemPropertyValueIds],
      []
    );
    const itemPropertyValues = await this.itemPropertiesService.findValuesByIds(
      itemPropertyValueIds
    );

    const video = VideoFactory.from(userId, input, itemPropertyValues);
    await this.videosRepository.save(video);
    await this.digestsProducer.updateItemDigestStatistics(
      input.digests.map((v) => v.itemId)
    );

    return video;
  }

  async update(id: number, input: UpdateVideoInput): Promise<Video> {
    const itemPropertyValueIds =
      input?.digests?.reduce(
        (acc, digest) => [...acc, ...(digest.itemPropertyValueIds ?? [])],
        []
      ) ?? [];
    const itemPropertyValues =
      itemPropertyValueIds.length > 0
        ? await this.itemPropertiesService.findValuesByIds(itemPropertyValueIds)
        : [];

    const video = await this.get(id, ['digests', 'digests.itemPropertyValues']);
    const { digests: videoDigests } = video;

    if (input.digests) {
      video.digests = input.digests.map((digest) =>
        DigestFactory.from({
          ...video.digests.find((v) => v.id === digest.id),
          ...digest,
          ...(digest.itemPropertyValueIds != null && {
            itemPropertyValues: findModelsByIds(
              digest.itemPropertyValueIds,
              itemPropertyValues
            ),
          }),
        })
      );
    }

    const updatedVideo = await this.videosRepository.save(
      new Video({
        ...video,
        ...input,
        digests: video.digests,
      })
    );
    await this.removeDeletedDigests(videoDigests, updatedVideo.digests);
    await this.digestsProducer.updateItemDigestStatistics(
      updatedVideo.digests.map(({ itemId }) => itemId)
    );
    return updatedVideo;
  }

  private async removeDeletedDigests(
    digests: Digest[],
    updatedDigests: Digest[]
  ) {
    if (updatedDigests === undefined) {
      return;
    }
    await this.digestsProducer.removeDigests(
      digests
        .filter(({ id }) => !findModelById(id, updatedDigests))
        .map(({ id }) => id)
    );
  }
}
