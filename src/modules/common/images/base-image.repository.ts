import { getConnection, EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { ImageRepository } from '@common/image.repository';

import { BaseImageEntity } from './entities';
import { BaseImage } from './models';

@EntityRepository(BaseImageEntity)
export class BaseImageRepository extends ImageRepository<
  BaseImageEntity,
  BaseImage
> {
  entityToModel(entity: BaseImageEntity, transformOptions = {}): BaseImage {
    return plainToClass(BaseImage, entity, transformOptions) as BaseImage;
  }

  entityToModelMany(
    entities: BaseImageEntity[],
    transformOptions = {}
  ): BaseImage[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async bulkInsert(keys: string[]): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(BaseImageEntity)
      .values(keys.map((key) => ({ key, rangle: 0 })))
      .execute();
  }
}
