import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { StyleTag } from './models';

import { StyleTagsRepository } from './style-tags.repository';

@Injectable()
export class StyleTagsService {
  constructor(
    @InjectRepository(StyleTagsRepository)
    private readonly styleTagsRepository: StyleTagsRepository
  ) {}

  async list(): Promise<StyleTag[]> {
    return await this.styleTagsRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }

  // @TODO: filter 적용해서 list랑 합치기
  async findByIds(ids: number[]): Promise<StyleTag[]> {
    return await this.styleTagsRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
