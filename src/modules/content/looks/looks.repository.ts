import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { PageInput } from '@common/dtos';
import { pageQuery } from '@common/helpers';

import { LookEntity } from './entities';
import { lookStyleTagsQuery } from './helpers';
import { Look } from './models';

@EntityRepository(LookEntity)
export class LooksRepository extends BaseRepository<LookEntity, Look> {
  entityToModel(entity: LookEntity, transformOptions = {}): Look {
    return plainToClass(Look, entity, transformOptions) as Look;
  }

  entityToModelMany(entities: LookEntity[], transformOptions = {}): Look[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async findIdsByStyleTags(
    styleTagIds: number[],
    pageInput?: PageInput
  ): Promise<number[]> {
    const raws = await pageQuery(
      lookStyleTagsQuery(this.createQueryBuilder('look'), styleTagIds),
      'look',
      pageInput
    )
      .select('look.id', 'id')
      .orderBy('look.id', 'DESC')
      .execute();

    return raws.map((raw) => raw.id);
  }
}
