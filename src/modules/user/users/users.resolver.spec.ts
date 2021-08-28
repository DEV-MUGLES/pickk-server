import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { JwtPayload } from '@auth/models';
import { PointsService } from '@order/points/points.service';

import { UpdateUserInput } from './dtos';
import { User } from './models';

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { FollowsService } from '@user/follows/follows.service';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: new UsersService(null, null),
        },
        {
          provide: PointsService,
          useValue: new PointsService(null, null, null, null),
        },
        {
          provide: FollowsService,
          useValue: new FollowsService(null, null),
        },
      ],
    }).compile();

    usersResolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersResolver).toBeDefined();
  });

  const payload: JwtPayload = {
    nickname: faker.lorem.text(),
    sub: faker.datatype.number(),
    iat: new Date().getTime(),
    exp: new Date().getTime(),
    isExpired: null,
  };
  const user = new User({
    id: payload.sub,
    nickname: payload.nickname,
  });

  describe('me', () => {
    it('should return current user', async () => {
      const usersServiceGetSpy = jest
        .spyOn(usersService, 'get')
        .mockResolvedValueOnce(user);

      const result = await usersResolver.me(payload);

      expect(result).toEqual(user);
      expect(usersServiceGetSpy).toHaveBeenCalledWith(payload.sub, []);
    });
  });

  describe('updateMe', () => {
    it('should return updated user', async () => {
      const updateUserInput: UpdateUserInput = {
        name: faker.lorem.text(),
      };
      const usersServiceUpdateSpy = jest
        .spyOn(usersService, 'update')
        .mockResolvedValueOnce(new User({ ...user, ...updateUserInput }));

      const result = await usersResolver.updateMe(payload, updateUserInput);

      expect(result.name).toEqual(updateUserInput.name);
      expect(usersServiceUpdateSpy).toHaveBeenCalledWith(
        payload.sub,
        updateUserInput
      );
    });
  });

  describe('updateMyPassword', () => {
    it('should return undefined when success', async () => {
      const user = new User();
      const oldPassword = faker.lorem.text(),
        newPassword = faker.lorem.text();

      const usersServiceUpdatePasswordSpy = jest
        .spyOn(usersService, 'updatePassword')
        .mockResolvedValueOnce(undefined);

      const result = await usersResolver.updateMyPassword(
        user,
        oldPassword,
        newPassword
      );

      expect(result).toEqual(undefined);
      expect(usersServiceUpdatePasswordSpy).toHaveBeenCalledWith(
        user,
        oldPassword,
        newPassword
      );
    });
  });
});
