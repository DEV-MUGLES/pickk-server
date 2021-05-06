import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  EntityRepository,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { plainToClass } from 'class-transformer';

import { ItemCategoryEntity } from './entities/item-category.entity';
import { ItemCategory } from './models/item-category.model';
import { MultipleEntityReturnedException } from '@src/common/exceptions/multiple-entity-returned.exception';

@EntityRepository(ItemCategoryEntity)
export class ItemCategoriesRepository extends Repository<ItemCategoryEntity> {
  private isEntity(obj: unknown): obj is ItemCategoryEntity {
    return obj !== undefined && (obj as ItemCategoryEntity).code !== undefined;
  }

  async getByCode(
    code: string,
    relations: string[] = []
  ): Promise<ItemCategory | null> {
    return await this.findOne({
      where: { code },
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
    inputs: DeepPartial<ItemCategoryEntity>,
    relations: string[] = []
  ): Promise<ItemCategory | null> {
    return this.save(inputs)
      .then(
        async (entity) =>
          await this.getByCode((entity as ItemCategoryEntity).code, relations)
      )
      .catch((error) => Promise.reject(error));
  }

  async updateEntity(
    entity: ItemCategory,
    inputs: QueryDeepPartialEntity<ItemCategoryEntity>,
    relations: string[] = []
  ): Promise<ItemCategory | null> {
    return this.update(entity.code, { ...inputs })
      .then(async () => await this.getByCode(entity.code, relations))
      .catch((error) => Promise.reject(error));
  }

  async findOneEntity(
    param: FindOneOptions<ItemCategory>['where'],
    relations: string[] = []
  ): Promise<ItemCategory | null> {
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

  entityToModel(
    entity: ItemCategoryEntity,
    transformOptions = {}
  ): ItemCategory {
    return plainToClass(ItemCategory, entity, transformOptions) as ItemCategory;
  }

  entityToModelMany(
    entities: ItemCategoryEntity[],
    transformOptions = {}
  ): ItemCategory[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
