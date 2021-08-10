import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { ExchangeRequestRelationType } from './constants';
import { ExchangeRequestFilter } from './dtos';
import { ExchangeRequest } from './models';

import { ExchangeRequestsRepository } from './exchange-requests.repository';

@Injectable()
export class ExchangeRequestsService {
  constructor(
    @InjectRepository(ExchangeRequestsRepository)
    private readonly exchangeRequestsRepository: ExchangeRequestsRepository
  ) {}

  async get(
    id: number,
    relations: ExchangeRequestRelationType[]
  ): Promise<ExchangeRequest> {
    return await this.exchangeRequestsRepository.get(id, relations);
  }

  async list(
    exchangeRequestFilter?: ExchangeRequestFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<ExchangeRequest[]> {
    const _exchangeRequestFilter = plainToClass(
      ExchangeRequestFilter,
      exchangeRequestFilter
    );
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.exchangeRequestsRepository.entityToModelMany(
      await this.exchangeRequestsRepository.find({
        relations,
        where: parseFilter(_exchangeRequestFilter, _pageInput?.idFilter),
        order: {
          id: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }
}
