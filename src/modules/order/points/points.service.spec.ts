import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { CacheService } from '@providers/cache/redis';

import { ExpectedPointEvent, PointEvent } from './models';

import { PointSign } from './constants';
import { CreateEventInput } from './dtos';
import { PointsService } from './points.service';
import {
  ExpectedPointEventsRepository,
  PointEventsRepository,
} from './points.repository';
import { ExpectedPointEventProducer } from './producers';

describe('PointsService', () => {
  let pointsService: PointsService;

  let pointEventsStore: PointEvent[] = [];
  let expectedPointEventsStore: ExpectedPointEvent[] = [];
  let cacheStore = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointsService,
        {
          provide: ExpectedPointEventProducer,
          useValue: {
            removeByOrderItemUid: jest.fn(),
          },
        },
        {
          provide: PointEventsRepository,
          useValue: {
            save: (input) => {
              pointEventsStore.push(input);
              return input;
            },
            getSum: () =>
              pointEventsStore.reduce((acc, v) => acc + v.amount, 0),
          },
        },
        {
          provide: ExpectedPointEventsRepository,
          useValue: {
            save: (input) => {
              expectedPointEventsStore.push(input);
              return input;
            },
            getSum: () =>
              expectedPointEventsStore.reduce((acc, v) => acc + v.amount, 0),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: (name: string) => cacheStore[name]?.toString(),
            set: (name: string, value: unknown) => {
              cacheStore[name] = String(value);
            },
          },
        },
      ],
    }).compile();

    pointsService = module.get<PointsService>(PointsService);

    pointEventsStore = [];
    expectedPointEventsStore = [];
    cacheStore = {};
  });
  describe('create', () => {
    it('성공적으로 수행한다.', async () => {
      const input: CreateEventInput = {
        title: faker.lorem.text(),
        sign: PointSign.Plus,
        amount: faker.datatype.number(),
        userId: faker.datatype.number(),
        orderItemMerchantUid: faker.lorem.word(),
      };

      const result = await pointsService.createEvent(input);

      expect(result).toEqual(input.amount);
      expect(pointEventsStore[pointEventsStore.length - 1].amount).toEqual(
        input.amount
      );
      expect(
        pointEventsStore[pointEventsStore.length - 1].resultBalance
      ).toEqual(input.amount);
    });

    it('잔고가 있을 때도 성공적으로 수행한다.', async () => {
      const input: CreateEventInput = {
        title: faker.lorem.text(),
        sign: PointSign.Plus,
        amount: faker.datatype.number(),
        userId: faker.datatype.number(),
        orderItemMerchantUid: faker.lorem.word(),
      };

      await pointsService.createEvent(input);
      const result = await pointsService.createEvent(input);

      expect(result).toEqual(input.amount * 2);
      expect(pointEventsStore[pointEventsStore.length - 1].amount).toEqual(
        input.amount
      );
      expect(
        pointEventsStore[pointEventsStore.length - 1].resultBalance
      ).toEqual(input.amount * 2);
    });
  });
});
