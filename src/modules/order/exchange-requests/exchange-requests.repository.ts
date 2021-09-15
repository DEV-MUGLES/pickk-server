import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { ExchangeRequestEntity } from './entities';
import { ExchangeRequest } from './models';

@EntityRepository(ExchangeRequestEntity)
export class ExchangeRequestsRepository extends Repository<ExchangeRequestEntity> {
  entityToModel(
    entity: ExchangeRequestEntity,
    transformOptions = {}
  ): ExchangeRequest {
    return plainToClass(
      ExchangeRequest,
      entity,
      transformOptions
    ) as ExchangeRequest;
  }

  entityToModelMany(
    entities: ExchangeRequestEntity[],
    transformOptions = {}
  ): ExchangeRequest[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async get(
    merchantUid: string,
    relations: string[] = []
  ): Promise<ExchangeRequest | null> {
    return await this.findOne({
      where: { merchantUid },
      relations,
    })
      .then((entity) => {
        if (!entity) {
          throw new NotFoundException('해당 교환요청이 존재하지 않습니다.');
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }
}
