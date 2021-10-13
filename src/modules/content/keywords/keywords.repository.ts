import { EntityRepository, getConnection } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { pageQuery } from '@common/helpers';
import { BaseRepository } from '@common/base.repository';

import { KeywordFilter } from './dtos';
import { KeywordEntity, KeywordClassEntity } from './entities';
import {
  keywordClassIdInQuery,
  keywordLikingQuery,
  keywordOwningQuery,
} from './helpers';
import { Keyword, KeywordClass } from './models';

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

  async countByClass(keywordClassId: number): Promise<number> {
    const KEYWORD_CLASSES_TABLE = 'keyword_classes_keyword_class';

    const runner = getConnection().createQueryRunner();
    const result = await runner.query(
      `SELECT count(*) as count 
          FROM ${KEYWORD_CLASSES_TABLE} 
          WHERE keywordClassId=${keywordClassId}`
    );
    runner.release();

    return result[0].count;
  }

  async getClassIds(id: number): Promise<number[]> {
    const KEYWORD_CLASSES_TABLE = 'keyword_classes_keyword_class';

    const runner = getConnection().createQueryRunner();
    const result = await runner.query(
      `SELECT keywordClassId
    FROM ${KEYWORD_CLASSES_TABLE} 
    WHERE keywordId=${id}`
    );
    runner.release();

    return result.map(({ keywordClassId }) => keywordClassId);
  }

  async findIds(
    filter: KeywordFilter,
    pageInput?: PageInput,
    userId?: number
  ): Promise<number[]> {
    const raws = await pageQuery(
      keywordLikingQuery(
        keywordOwningQuery(
          keywordClassIdInQuery(
            this.createQueryBuilder('keyword'),
            filter.keywordClassIdIn
          ),
          userId,
          filter.isOwning
        ),
        userId,
        filter.isLiking
      ),
      'keyword',
      pageInput
    )
      .select('keyword.id', 'id')
      .orderBy('keyword.score', 'DESC')
      .execute();

    return raws.map((raw) => raw.id);
  }
}

@EntityRepository(KeywordClassEntity)
export class KeywordClassesRepository extends BaseRepository<
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
