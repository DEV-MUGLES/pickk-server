import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { LookRelationType } from './constants';
import { LookFilter } from './dtos';
import { Look } from './models';

import { LooksRepository } from './looks.repository';
@Injectable()
export class LooksService {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository
  ) {}

  async list(
    filter?: LookFilter,
    pageInput?: PageInput,
    relations: LookRelationType[] = []
  ): Promise<Look[]> {
    const _filter = plainToClass(LookFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.looksRepository.entityToModelMany(
      await this.looksRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }
}
