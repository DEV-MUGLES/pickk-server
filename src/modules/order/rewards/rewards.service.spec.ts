import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { CacheService } from '@providers/cache/redis';

import { RewardEvent } from './models';

import { RewardEventsRepository } from './rewards.repository';
import { RewardsService } from './rewards.service';
import { RewardSign } from './constants';
import { CreateRewardEventInput } from './dtos';

describe('RewardsService', () => {
  let rewardsService: RewardsService;

  let rewardEventsStore: RewardEvent[] = [];
  let cacheStore = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: RewardEventsRepository,
          useValue: {
            save: (input) => rewardEventsStore.push(input),
            getSum: () =>
              rewardEventsStore.reduce((acc, v) => acc + v.amount, 0),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: (name: string) => String(cacheStore[name]),
            set: (name: string, value: unknown) => {
              cacheStore[name] = String(value);
            },
          },
        },
      ],
    }).compile();

    rewardsService = module.get<RewardsService>(RewardsService);

    rewardEventsStore = [];
    cacheStore = {};
  });
  describe('create', () => {
    it('성공적으로 수행한다.', async () => {
      const input: CreateRewardEventInput = {
        title: faker.lorem.text(),
        sign: RewardSign.Plus,
        amount: faker.datatype.number(),
        userId: faker.datatype.number(),
        recommendDigestId: null,
        orderItemMerchantUid: faker.lorem.word(),
      };

      const result = await rewardsService.create(input);

      expect(result).toEqual(input.amount);
      expect(rewardEventsStore[rewardEventsStore.length - 1].amount).toEqual(
        input.amount
      );
      expect(
        rewardEventsStore[rewardEventsStore.length - 1].resultBalance
      ).toEqual(input.amount);
    });

    it('잔고가 있을 때도 성공적으로 수행한다.', async () => {
      const input: CreateRewardEventInput = {
        title: faker.lorem.text(),
        sign: RewardSign.Plus,
        amount: faker.datatype.number(),
        userId: faker.datatype.number(),
        recommendDigestId: null,
        orderItemMerchantUid: faker.lorem.word(),
      };

      await rewardsService.create(input);
      const result = await rewardsService.create(input);

      expect(result).toEqual(input.amount * 2);
      expect(rewardEventsStore[rewardEventsStore.length - 1].amount).toEqual(
        input.amount
      );
      expect(
        rewardEventsStore[rewardEventsStore.length - 1].resultBalance
      ).toEqual(input.amount * 2);
    });
  });
});
