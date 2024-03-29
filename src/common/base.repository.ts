import { NotFoundException } from '@nestjs/common';
import { Repository, DeepPartial, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { MultipleEntityReturnedException } from './exceptions';

export abstract class BaseRepository<
  Entity extends { id: number },
  Model extends { id: number }
> extends Repository<Entity> {
  protected isEntity(obj: unknown): obj is Entity {
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
    return this.update(entity.id, { ...inputs })
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

  abstract entityToModel(entity: Entity, transformOptions?): Model;

  abstract entityToModelMany(entities: Entity[], transformOptions?): Model[];
}
