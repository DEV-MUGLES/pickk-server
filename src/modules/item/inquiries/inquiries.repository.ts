import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { InquiryAnswerEntity, InquiryEntity } from './entities';
import { Inquiry, InquiryAnswer } from './models';

@EntityRepository(InquiryEntity)
export class InquiriesRepository extends BaseRepository<
  InquiryEntity,
  Inquiry
> {
  entityToModel(entity: InquiryEntity, transformOptions = {}): Inquiry {
    return plainToClass(Inquiry, entity, transformOptions) as Inquiry;
  }

  entityToModelMany(
    entities: InquiryEntity[],
    transformOptions = {}
  ): Inquiry[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(InquiryAnswerEntity)
export class InquiryAnswersRepository extends BaseRepository<
  InquiryAnswerEntity,
  InquiryAnswer
> {
  entityToModel(
    entity: InquiryAnswerEntity,
    transformOptions = {}
  ): InquiryAnswer {
    return plainToClass(
      InquiryAnswer,
      entity,
      transformOptions
    ) as InquiryAnswer;
  }

  entityToModelMany(
    entities: InquiryAnswerEntity[],
    transformOptions = {}
  ): InquiryAnswer[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
