import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { InquiryRelationType } from './constants';
import {
  AnswerInquiryInput,
  CreateInquiryInput,
  InquiryFilter,
  UpdateInquiryAnswerInput,
} from './dtos';
import { Inquiry, InquiryAnswer } from './models';

import {
  InquiriesRepository,
  InquiryAnswersRepository,
} from './inquiries.repository';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(InquiriesRepository)
    private readonly inquiriesRepository: InquiriesRepository,
    @InjectRepository(InquiryAnswersRepository)
    private readonly inquiryAnswersRepository: InquiryAnswersRepository
  ) {}

  async count(itemId: number): Promise<number> {
    return await this.inquiriesRepository.count({ where: { itemId } });
  }

  async get(
    id: number,
    relations: InquiryRelationType[] = []
  ): Promise<Inquiry> {
    return await this.inquiriesRepository.get(id, relations);
  }

  async getAnswer(
    id: number,
    relations: string[] = []
  ): Promise<InquiryAnswer> {
    return await this.inquiryAnswersRepository.get(id, relations);
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
        order: {
          id: 'DESC',
        },
      })
    );
  }

  async create(input: CreateInquiryInput): Promise<Inquiry> {
    return await this.inquiriesRepository.save(new Inquiry(input));
  }

  async remove(inquiry: Inquiry): Promise<void> {
    await this.inquiriesRepository.remove(inquiry);
  }

  async answer(id: number, input: AnswerInquiryInput): Promise<Inquiry> {
    const inquiry = await this.get(id, ['answers']);
    inquiry.answer(input);

    return await this.inquiriesRepository.save(inquiry);
  }

  async updateAnswer(
    answerId: number,
    input: UpdateInquiryAnswerInput
  ): Promise<InquiryAnswer> {
    const inquiryAnswer = await this.getAnswer(answerId);
    return await this.inquiryAnswersRepository.save(
      new InquiryAnswer({
        ...inquiryAnswer,
        ...input,
      })
    );
  }
}
