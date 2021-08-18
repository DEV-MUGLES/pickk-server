import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { DigestEntity } from './entities';
import { Digest } from './models';

@EntityRepository(DigestEntity)
export class DigestsRepository extends BaseRepository<DigestEntity, Digest> {
  entityToModel(entity: DigestEntity, transformOptions = {}): Digest {
    return plainToClass(Digest, entity, transformOptions) as Digest;
  }

  entityToModelMany(entities: DigestEntity[], transformOptions = {}): Digest[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
