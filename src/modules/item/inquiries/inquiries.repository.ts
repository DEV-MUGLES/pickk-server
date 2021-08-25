import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { InquiryEntity } from './entities';
import { Inquiry } from './models';

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
