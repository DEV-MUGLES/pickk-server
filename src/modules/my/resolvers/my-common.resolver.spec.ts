import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { JwtPayload } from '@auth/models';
import { AwsS3ProviderModule } from '@providers/aws/s3';

import { FollowsService } from '@user/follows/follows.service';
import {
  RefundAccountsRepository,
  ShippingAddressesRepository,
  UsersRepository,
} from '@user/users/users.repository';
import { UsersService } from '@user/users/users.service';

import { MyCommonResolver } from './my-common.resolver';

const JWT_TOKEN = 'JWT_TOKEN';

describe('MyCommonResolver', () => {
  let myCommonResolver: MyCommonResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AwsS3ProviderModule],
      providers: [
        MyCommonResolver,
        UsersService,
        UsersRepository,
        ShippingAddressesRepository,
        RefundAccountsRepository,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => JWT_TOKEN),
          },
        },
        {
          provide: FollowsService,
          useValue: new FollowsService(null, null),
        },
      ],
    }).compile();

    myCommonResolver = module.get<MyCommonResolver>(MyCommonResolver);
  });

  it('should be defined', () => {
    expect(myCommonResolver).toBeDefined();
  });

  const payload: JwtPayload = {
    nickname: faker.lorem.text(),
    sub: faker.datatype.number(),
    iat: new Date().getTime(),
    exp: new Date().getTime(),
    isExpired: null,
  };

  describe('myJwtPayload', () => {
    it('should return payload', () => {
      const result = myCommonResolver.myJwtPayload(payload);
      expect(result).toEqual(payload);
    });
  });
});
