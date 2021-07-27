import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PaymentEntity } from './entities';
import { Payment } from './models';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(PaymentEntity)
export class PaymentsRepository extends Repository<PaymentEntity> {
  entityToModel(entity: PaymentEntity, transformOptions = {}): Payment {
    return plainToClass(Payment, entity, transformOptions) as Payment;
  }

  entityToModelMany(
    entities: PaymentEntity[],
    transformOptions = {}
  ): Payment[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async get(
    merchantUid: string,
    relations: string[] = []
  ): Promise<Payment | null> {
    return await this.findOne({
      where: { merchantUid },
      relations,
    })
      .then((entity) => {
        if (!entity) {
          throw new NotFoundException('존재하지 않는 결제건입니다.');
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }

  async checkExist(merchantUid: string): Promise<boolean> {
    const result = await this.createQueryBuilder('payment')
      .select('1')
      .where('payment.merchantUid = :merchantUid', { merchantUid })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }
}
