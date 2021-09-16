import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

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
    merchantUid: string,
    relations: ExchangeRequestRelationType[] = []
  ): Promise<ExchangeRequest> {
    return await this.exchangeRequestsRepository.get(merchantUid, relations);
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
          merchantUid: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async markReshipped(merchantUid: string): Promise<ExchangeRequest> {
    const exchangeRequest = await this.get(merchantUid, ['orderItem']);
    exchangeRequest.markReshipped();

    return await this.exchangeRequestsRepository.save(exchangeRequest);
  }
}
