import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { pageQuery } from '@common/helpers';
import { BaseRepository } from '@common/base.repository';

import { LookFilter } from './dtos';
import { LookEntity } from './entities';
import {
  lookItemIdQuery,
  lookStyleTagsQuery,
  lookUserHeightQuery,
} from './helpers';
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

  async findIdsByItemId(
    itemId: number,
    pageInput?: PageInput
  ): Promise<number[]> {
    const raws = await pageQuery(
      lookItemIdQuery(this.createQueryBuilder('look'), itemId),
      'look',
      pageInput
    )
      .select('look.id', 'id')
      .orderBy(`look.score`, 'DESC')
      .execute();

    return raws.map((raw) => raw.id);
  }

  async findIdsByStyleTags(
    filter: LookFilter,
    pageInput?: PageInput
  ): Promise<number[]> {
    let qb = pageQuery(
      lookStyleTagsQuery(this.createQueryBuilder('look'), filter.styleTagIdIn),
      'look',
      pageInput
    )
      .select('look.id', 'id')
      .orderBy(`look.${filter.orderBy}`, 'DESC');

    if (filter.user?.heightBetween) {
      qb = lookUserHeightQuery(qb, filter.user.heightBetween);
    }

    const raws = await qb.execute();

    return raws.map((raw) => raw.id);
  }
}
