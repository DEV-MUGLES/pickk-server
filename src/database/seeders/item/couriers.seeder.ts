import faker from 'faker';
import { Injectable } from '@nestjs/common';

import { CouriersService } from '@item/couriers/couriers.service';
import { CreateCourierInput } from '@item/couriers/dtos/courier.input';
import { Courier } from '@item/couriers/models/courier.model';

@Injectable()
export class CouriersSeeder {
  constructor(private couriersService: CouriersService) {}

  async create(): Promise<Courier> {
    const createInput: CreateCourierInput = {
      name: faker.name.firstName(),
      code: faker.datatype.string(10),
      phoneNumber: '010' + faker.datatype.number({ precision: 8 }),
      returnReserveUrl: faker.internet.url(),
    };

    return await this.couriersService.create(createInput);
  }
}
