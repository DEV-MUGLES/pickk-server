import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DigestsExhibitionRelationType } from './constants';
import { DigestsExhibition, DigestsExhibitionDigest } from './models';

import {
  DigestsExhibitionDigestsRepository,
  DigestsExhibitionsRepository,
} from './digests-exhibitions.repository';

@Injectable()
export class DigestsExhibitionsService {
  constructor(
    @InjectRepository(DigestsExhibitionsRepository)
    private readonly digestsExhibitionsRepository: DigestsExhibitionsRepository,
    @InjectRepository(DigestsExhibitionDigestsRepository)
    private readonly digestsExhibitionDigestsRepository: DigestsExhibitionDigestsRepository
  ) {}

  async get(
    id: number,
    relations: DigestsExhibitionRelationType[] = []
  ): Promise<DigestsExhibition> {
    return await this.digestsExhibitionsRepository.get(id, relations);
  }

  async list(
    relations: DigestsExhibitionRelationType[] = []
  ): Promise<DigestsExhibition[]> {
    return this.digestsExhibitionsRepository.entityToModelMany(
      await this.digestsExhibitionsRepository.find({
        relations,
      })
    );
  }

  async updateDigests(id: number, digestIds: number[]): Promise<void> {
    const exhibition = await this.get(id, ['exhibitionDigests']);

    await this.digestsExhibitionDigestsRepository.remove(
      exhibition.exhibitionDigests
    );

    exhibition.exhibitionDigests = digestIds.map(
      (digestId, index) =>
        new DigestsExhibitionDigest({
          digestId,
          order: index,
        })
    );

    await this.digestsExhibitionsRepository.save(exhibition);
  }
}
