import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { LookRelationType } from './constants';
import { LookFilter } from './dtos';
import { LookEntity } from './entities';
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
    return this.looksRepository.entityToModelMany(
      await this.looksRepository.find({
        relations,
        ...(await this.getFindOptions(filter, pageInput)),
        order: {
          id: 'DESC',
        },
      })
    );
  }

  private async getFindOptions(
    filter?: LookFilter,
    pageInput?: PageInput
  ): Promise<FindManyOptions<LookEntity>> {
    const _filter = plainToClass(LookFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    if (_filter?.styleTagIdIn?.length > 0) {
      const ids = await this.looksRepository.findIdsByStyleTags(
        _filter.styleTagIdIn
      );

      return { where: { ...parseFilter(_filter), id: In(ids) } };
    }

    return {
      where: parseFilter(_filter, _pageInput?.idFilter),
      ...(_pageInput?.pageFilter ?? {}),
    };
  }
}
