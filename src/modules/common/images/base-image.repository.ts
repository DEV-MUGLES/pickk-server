import { NotFoundException } from '@nestjs/common';
import { getConnection, EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseImageEntity } from './entities/base-image.entity';
import { BaseImage } from './models/base-image.model';

@EntityRepository(BaseImageEntity)
export class BaseImageRepository extends Repository<BaseImageEntity> {
  private isEntity(obj: unknown): obj is BaseImageEntity {
    return obj !== undefined && (obj as BaseImageEntity).key !== undefined;
  }

  async getByKey(key: string): Promise<BaseImage | null> {
    return await this.findOne({
      where: { key },
    })
      .then((entity) => {
        if (!this.isEntity(entity)) {
          throw new NotFoundException('BaseImage not found.');
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }

  async bulkInsert(keys: string[]): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(BaseImageEntity)
      .values(keys.map((key) => ({ key, rangle: 0 })))
      .execute();
  }

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
}
