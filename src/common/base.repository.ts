import { plainToClass } from 'class-transformer';
import { Repository, DeepPartial, FindOneOptions, Entity } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { BaseEntity } from './entities/base.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MultipleEntityReturnedException } from '@src/common/exceptions/multiple-entity-returned.exception';

export class BaseRepository<
  Entity extends BaseEntity,
  Model extends BaseEntity
> extends Repository<Entity> {
  private isEntity(obj: unknown): obj is Entity {
    return obj !== undefined && (obj as Entity).id !== undefined;
  }

  async get(id: number, relations: string[] = []): Promise<Model | null> {
    return await this.findOne({
      where: { id },
      relations,
    })
      .then((entity) => {
        if (!this.isEntity(entity)) {
          throw new NotFoundException('Model not found.');
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }

  async createEntity(
    inputs: DeepPartial<Entity>,
    relations: string[] = []
  ): Promise<Model | null> {
    return this.save(inputs)
      .then(async (entity) => await this.get((entity as any).id, relations))
      .catch((error) => Promise.reject(error));
  }

  async updateEntity(
    entity: Model,
    inputs: QueryDeepPartialEntity<Entity>,
    relations: string[] = []
  ): Promise<Model | null> {
    return this.update(entity.id, inputs)
      .then(async () => await this.get(entity.id, relations))
      .catch((error) => Promise.reject(error));
  }

  async findOneEntity(
    param: FindOneOptions<Model>['where'],
    relations: string[] = []
  ): Promise<Model | null> {
    return await this.find({
      where: param,
      relations,
    }).then((entities) => {
      if (entities.length > 1) {
        throw new MultipleEntityReturnedException();
      }
      if (entities.length === 0 || !this.isEntity(entities[0])) {
        return null;
      }

      return Promise.resolve(this.entityToModel(entities[0]));
    });
  }

  entityToModel(entity: Entity, transformOptions = {}): Model {
    if (Array.isArray(entity)) {
      throw new MultipleEntityReturnedException();
    }
    return plainToClass(BaseEntity, entity, transformOptions) as Model;
  }

  entityToModelMany(entities: Entity[], transformOptions = {}): Model[] {
    return entities.map((model) => this.entityToModel(model, transformOptions));
  }
}
