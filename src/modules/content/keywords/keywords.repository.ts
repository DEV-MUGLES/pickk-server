import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import {
  KeywordEntity,
  KeywordClassEntity,
  KeywordMatchTagEntity,
} from './entities';
import { Keyword, KeywordClass, KeywordMatchTag } from './models';

@EntityRepository(KeywordEntity)
export class KeywordsRepository extends BaseRepository<KeywordEntity, Keyword> {
  entityToModel(entity: KeywordEntity, transformOptions = {}): Keyword {
    return plainToClass(Keyword, entity, transformOptions) as Keyword;
  }

  entityToModelMany(
    entities: KeywordEntity[],
    transformOptions = {}
  ): Keyword[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(KeywordClassEntity)
export class KeywordClasssRepository extends BaseRepository<
  KeywordClassEntity,
  KeywordClass
> {
  entityToModel(
    entity: KeywordClassEntity,
    transformOptions = {}
  ): KeywordClass {
    return plainToClass(KeywordClass, entity, transformOptions) as KeywordClass;
  }

  entityToModelMany(
    entities: KeywordClassEntity[],
    transformOptions = {}
  ): KeywordClass[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(KeywordMatchTagEntity)
export class KeywordMatchTagsRepository extends BaseRepository<
  KeywordMatchTagEntity,
  KeywordMatchTag
> {
  entityToModel(
    entity: KeywordMatchTagEntity,
    transformOptions = {}
  ): KeywordMatchTag {
    return plainToClass(
      KeywordMatchTag,
      entity,
      transformOptions
    ) as KeywordMatchTag;
  }

  entityToModelMany(
    entities: KeywordMatchTagEntity[],
    transformOptions = {}
  ): KeywordMatchTag[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}