import faker from 'faker';
import { Injectable } from '@nestjs/common';

import { CreateCourierInput } from '@item/couriers/dtos';
import { Courier } from '@item/couriers/models';
import { CouriersService } from '@item/couriers/couriers.service';

import { COURIER_COUNT } from '../data';

@Injectable()
export class CouriersSeeder {
  constructor(private couriersService: CouriersService) {}

  createCourierInputs(): CreateCourierInput[] {
    return [...Array(COURIER_COUNT)].map(() => ({
      name: faker.name.firstName() + faker.name.lastName(),
      code: faker.datatype.string(10),
      phoneNumber: faker.phone.phoneNumber('010########'),
      returnReserveUrl: faker.internet.url(),
    }));
  }

  async create(): Promise<Courier[]> {
    return await Promise.all(
      this.createCourierInputs().map((courierInput) =>
        this.couriersService.create(courierInput)
      )
    ).then((couriers) => couriers);
  }
}
