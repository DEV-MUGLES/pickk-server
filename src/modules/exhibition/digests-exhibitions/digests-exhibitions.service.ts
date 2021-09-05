import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DigestsExhibitionRelationType } from './constants';
import { DigestsExhibition } from './models';

import { DigestsExhibitionsRepository } from './digests-exhibitions.repository';

@Injectable()
export class DigestsExhibitionsService {
  constructor(
    @InjectRepository(DigestsExhibitionsRepository)
    private readonly digestsExhibitionsRepository: DigestsExhibitionsRepository
  ) {}

  async list(
    relations: DigestsExhibitionRelationType[] = []
  ): Promise<DigestsExhibition[]> {
    return this.digestsExhibitionsRepository.entityToModelMany(
      await this.digestsExhibitionsRepository.find({
        relations,
      })
    );
  }
}
