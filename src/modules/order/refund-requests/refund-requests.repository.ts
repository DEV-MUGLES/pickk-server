import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { RefundRequestEntity } from './entities';
import { RefundRequest } from './models';

@EntityRepository(RefundRequestEntity)
export class RefundRequestsRepository extends Repository<RefundRequestEntity> {
  entityToModel(
    entity: RefundRequestEntity,
    transformOptions = {}
  ): RefundRequest {
    return plainToClass(
      RefundRequest,
      entity,
      transformOptions
    ) as RefundRequest;
  }

  entityToModelMany(
    entities: RefundRequestEntity[],
    transformOptions = {}
  ): RefundRequest[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async get(
    merchantUid: string,
    relations: string[] = []
  ): Promise<RefundRequest | null> {
    return await this.findOne({
      where: { merchantUid },
      relations,
    })
      .then((entity) => {
        if (!entity) {
          throw new NotFoundException('해당 반품요청이 존재하지 않습니다.');
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }
}
