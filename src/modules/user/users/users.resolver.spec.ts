import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { JwtPayload } from '@auth/models';
import { CacheService } from '@providers/cache/redis';

import { DigestsService } from '@content/digests/digests.service';
import { LooksService } from '@content/looks/looks.service';
import { VideosService } from '@content/videos/videos.service';
import { OrderItemsService } from '@order/order-items/order-items.service';
import { PointsService } from '@order/points/points.service';
import { FollowsService } from '@user/follows/follows.service';

import { UpdateUserInput } from './dtos';
import { User } from './models';

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: new UsersService(null, null, null, null),
        },
        {
          provide: PointsService,
          useValue: new PointsService(null, null, null, null),
        },
        {
          provide: FollowsService,
          useValue: new FollowsService(null, null),
        },
        {
          provide: OrderItemsService,
          useValue: new OrderItemsService(null, null, null),
        },
        {
          provide: DigestsService,
          useValue: new DigestsService(
            null,
            null,
            null,
            null,
            null,
            null,
            null
          ),
        },
        {
          provide: VideosService,
          useValue: new VideosService(null, null, null, null, null),
        },
        {
          provide: LooksService,
          useValue: new LooksService(null, null, null, null, null, null, null),
        },
        {
          provide: CacheService,
          useValue: new CacheService(null),
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
        .mockImplementationOnce(() => null);
      const usersServiceGetSpy = jest
        .spyOn(usersService, 'get')
        .mockResolvedValueOnce(new User({ ...user, ...updateUserInput }));

      const result = await usersResolver.updateMe(payload, updateUserInput);

      expect(result.name).toEqual(updateUserInput.name);
      expect(usersServiceUpdateSpy).toHaveBeenCalledWith(
        payload.sub,
        updateUserInput
      );
      expect(usersServiceGetSpy).toHaveBeenCalledWith(payload.sub, []);
    });
  });
});
