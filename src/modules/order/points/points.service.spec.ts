import faker from 'faker';
import { TestingModule, Test } from '@nestjs/testing';
import { CacheService } from '@providers/cache/redis/provider.service';
import { PointType } from './constants/points.enum';
import { CreateAddEventInput } from './dtos/point-event.dto';
import { ExpectedPointEvent } from './models';
import {
  ExpectedPointEventsRepository,
  PointEventsRepository,
} from './points.repository';
import { PointsService } from './points.service';
import { PreconditionFailedException } from '@nestjs/common';

const mockCacheService = {
  async get() {
    return '';
  },
  async set() {
    return '';
  },
};

describe('pointsService', () => {
  let pointsService: PointsService;
  let pointEventsRepository: PointEventsRepository;
  let expectedPointEventsRepository: ExpectedPointEventsRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointsService,
        PointEventsRepository,
        ExpectedPointEventsRepository,
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();
    pointsService = module.get<PointsService>(PointsService);
    pointEventsRepository = module.get<PointEventsRepository>(
      PointEventsRepository
    );
    expectedPointEventsRepository = module.get<ExpectedPointEventsRepository>(
      ExpectedPointEventsRepository
    );
  });

  describe('createAddEvent', () => {
    const userId = 1;
    const availableAmount = faker.datatype.number({ min: 100, max: 10000 });
    beforeEach(() => {
      jest
        .spyOn(pointsService, 'getAvailableAmount')
        .mockResolvedValue(availableAmount);
      jest
        .spyOn(pointsService, 'updateAvailableAmount')
        .mockImplementation(jest.fn());
      jest
        .spyOn(pointEventsRepository, 'save')
        .mockImplementation(async (v) => v as any);
    });

    const createAddEventInput: CreateAddEventInput = {
      amount: faker.datatype.number({ min: 100, max: 1000 }),
      title: faker.datatype.string(10),
      content: faker.datatype.string(10),
    };

    it('적립예정포인트로 포인트이벤트를 성공적으로 생성한다.', async () => {
      const expectedPointEvent = new ExpectedPointEvent({
        id: 1,
        ...createAddEventInput,
        orderId: 1,
        userId: 1,
      });

      jest
        .spyOn(pointsService, 'removeExpectedEvent')
        .mockImplementation(jest.fn());
      jest
        .spyOn(expectedPointEventsRepository, 'get')
        .mockImplementation(async () => expectedPointEvent);

      const pointEvent = await pointsService.createAddEvent(
        userId,
        undefined,
        expectedPointEvent.id
      );
      expect(pointEvent).toMatchObject(expectedPointEvent);
      expect(pointEvent.type).toEqual(PointType.Add);
      expect(pointEvent.resultBalance).toEqual(
        availableAmount + expectedPointEvent.amount
      );
    });

    it('createAddEventInput으로 포인트이벤트가 성공적으로 생성된다', async () => {
      const pointEvent = await pointsService.createAddEvent(
        userId,
        createAddEventInput
      );

      expect(pointEvent).toMatchObject(createAddEventInput);
      expect(pointEvent.resultBalance).toEqual(
        availableAmount + createAddEventInput.amount
      );
      expect(pointEvent.type).toEqual(PointType.Add);
    });

    it('createAddEventInput와 적립예정포인트가 undefined이면, PreconditionFailedException가 발생한다.', async () => {
      expect(pointsService.createAddEvent(userId)).rejects.toThrow(
        PreconditionFailedException
      );
    });

    it('createAddEventInput과 적립예정포인트가 모두 주어지면, PreconditionFailedException가 발생한다', async () => {
      const expectedPointEvent = new ExpectedPointEvent({
        id: 1,
        ...createAddEventInput,
      });
      expect(
        pointsService.createAddEvent(
          userId,
          createAddEventInput,
          expectedPointEvent.id
        )
      ).rejects.toThrow(PreconditionFailedException);
    });
  });
});
