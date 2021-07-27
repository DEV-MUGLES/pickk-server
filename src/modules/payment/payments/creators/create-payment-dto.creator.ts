import { getRandomEnumValue } from '@common/helpers';
import * as faker from 'faker';
import { PayEnviroment, PayMethod, Pg } from '../constants';

import { CreatePaymentDto } from '../dtos';

export class CreatePaymentDtoCreator {
  static create(): CreatePaymentDto {
    return new CreatePaymentDto({
      merchantUid: faker.lorem.text(),
      env: getRandomEnumValue(PayEnviroment) as PayEnviroment,
      origin: faker.internet.url(),
      pg: getRandomEnumValue(Pg) as Pg,
      payMethod: getRandomEnumValue(PayMethod) as PayMethod,
      name: faker.lorem.text(),
      amount: faker.datatype.number({ min: 1000, max: 1000000 }),
      buyerName: faker.name.findName(),
      buyerEmail: faker.internet.email(),
      buyerTel: faker.phone.phoneNumber('###-####-####'),
      buyerAddr: '사랑시 고백구 행복동',
      buyerPostalcode: faker.phone.phoneNumber('#####'),
    });
  }
}
