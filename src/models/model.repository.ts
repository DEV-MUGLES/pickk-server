import { plainToClass } from 'class-transformer';
import { Repository, DeepPartial, FindOneOptions } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { ModelEntity } from '../common/serializers/model.serializer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MultipleEntityReturnedException } from 'src/common/exceptions/multiple-entity-returned.exception';

export class ModelRepository<T, K extends ModelEntity> extends Repository<T> {
  private isEntity(obj: unknown): obj is K {
    return obj !== undefined && (obj as K).id !== undefined;
  }

  async get(id: number, relations: string[] = []): Promise<K | null> {
    return await this.findOne({
      where: { id },
      relations,
    })
      .then((entity) => {
        if (!this.isEntity(entity)) {
          throw new NotFoundException('Model not found.');
        }

        return Promise.resolve(this.transform(entity));
      })
      .catch((error) => Promise.reject(error));
  }

  async createEntity(
    inputs: DeepPartial<T>,
    relations: string[] = []
  ): Promise<K | null> {
    return this.save(inputs)
      .then(async (entity) => await this.get((entity as any).id, relations))
      .catch((error) => Promise.reject(error));
  }

  async updateEntity(
    entity: K,
    inputs: QueryDeepPartialEntity<T>,
    relations: string[] = []
  ): Promise<K | null> {
    return this.update(entity.id, inputs)
      .then(async () => await this.get(entity.id, relations))
      .catch((error) => Promise.reject(error));
  }

  async findOneEntity(
    param: FindOneOptions<T>['where'],
    relations: string[] = []
  ): Promise<K | null> {
    return await this.find({
      where: param,
      relations,
    }).then((entities) => {
      if (entities.length > 1) {
        throw new MultipleEntityReturnedException();
      }
      if (entities.length === 0 || !this.isEntity(entities[0])) {
        throw new NotFoundException('Model not found.');
      }

      return Promise.resolve(this.transform(entities[0]));
    });
  }

  transform(model: T, transformOptions = {}): K {
    return plainToClass(ModelEntity, model, transformOptions) as K;
  }

  transformMany(models: T[], transformOptions = {}): K[] {
    return models.map((model) => this.transform(model, transformOptions));
  }
}
