import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { VideoRelationType } from './constants';
import { VideoFilter } from './dtos';
import { Video } from './models';

import { VideosRepository } from './videos.repository';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videosRepository: VideosRepository
  ) {}

  async list(
    filter?: VideoFilter,
    pageInput?: PageInput,
    relations: VideoRelationType[] = []
  ): Promise<Video[]> {
    const _filter = plainToClass(VideoFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.videosRepository.entityToModelMany(
      await this.videosRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
        order: {
          [filter.orderBy]: 'DESC',
        },
      })
    );
  }
}
