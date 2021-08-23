import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { LookFilter } from '@content/looks/dtos';

import { KeywordRelationType } from './constants';
import { KeywordFilter } from './dtos';
import { Keyword } from './models';

import { KeywordsRepository } from './keywords.repository';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(KeywordsRepository)
    private readonly keywordsRepository: KeywordsRepository
  ) {}

  async list(
    filter?: KeywordFilter,
    pageInput?: PageInput,
    relations: KeywordRelationType[] = []
  ): Promise<Keyword[]> {
    const _filter = plainToClass(LookFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.keywordsRepository.entityToModelMany(
      await this.keywordsRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }
}
