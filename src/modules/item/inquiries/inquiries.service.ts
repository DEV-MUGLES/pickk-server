import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { InquiryRelationType } from './constants';
import { CreateInquiryInput, InquiryFilter } from './dtos';
import { Inquiry } from './models';

import { InquiriesRepository } from './inquiries.repository';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(InquiriesRepository)
    private readonly inquiriesRepository: InquiriesRepository
  ) {}

  async get(
    id: number,
    relations: InquiryRelationType[] = []
  ): Promise<Inquiry> {
    return await this.inquiriesRepository.get(id, relations);
  }

  async list(
    filter?: InquiryFilter,
    pageInput?: PageInput,
    relations: InquiryRelationType[] = []
  ): Promise<Inquiry[]> {
    const _filter = plainToClass(InquiryFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.inquiriesRepository.entityToModelMany(
      await this.inquiriesRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async create(input: CreateInquiryInput): Promise<Inquiry> {
    return await this.inquiriesRepository.save(new Inquiry(input));
  }
}
