import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { ItemPropertyFilter } from './dtos';
import { ItemProperty } from './models';

import {
  ItemPropertiesRepository,
  ItemPropertyValuesRepository,
} from './item-properties.repository';

@Injectable()
export class ItemPropertiesService {
  constructor(
    @InjectRepository(ItemPropertiesRepository)
    private readonly itemPropertiesRepository: ItemPropertiesRepository,
    @InjectRepository(ItemPropertyValuesRepository)
    private readonly itemPropertyValuesRepository: ItemPropertyValuesRepository
  ) {}

  async list(
    filter?: ItemPropertyFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<ItemProperty[]> {
    const _filter = plainToClass(ItemPropertyFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.itemPropertiesRepository.entityToModelMany(
      await this.itemPropertiesRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async getItemPropertyValues(ids: number[]) {
    return this.itemPropertyValuesRepository.entityToModelMany(
      await this.itemPropertyValuesRepository.findByIds(ids)
    );
  }
}
