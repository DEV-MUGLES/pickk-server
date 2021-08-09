import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RefundRequestRelationType } from './constants';
import { RefundRequest } from './models';

import { RefundRequestsRepository } from './refund-requests.repository';

@Injectable()
export class RefundRequestsService {
  constructor(
    @InjectRepository(RefundRequestsRepository)
    private readonly refundRequestsRepository: RefundRequestsRepository
  ) {}

  async get(
    id: number,
    relations: RefundRequestRelationType[]
  ): Promise<RefundRequest> {
    return await this.refundRequestsRepository.get(id, relations);
  }
}
