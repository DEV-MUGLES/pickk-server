import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { CouriersRepository } from './couriers.repository';
import { CouriersService } from './couriers.service';
import { UpdateCourierIssueInput } from './dto/courier-issue.input';
import { CourierIssue } from './models/courier-issue.model';
import { Courier } from './models/courier.model';

describe('CouriersService', () => {
  let couriersService: CouriersService;
  let couriersRepository: CouriersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouriersService, CouriersRepository],
    }).compile();

    couriersService = module.get<CouriersService>(CouriersService);
    couriersRepository = module.get<CouriersRepository>(CouriersRepository);
  });

  describe('updateIssue', () => {
    const updateCourierIssueInput: UpdateCourierIssueInput = {
      message: faker.lorem.text(),
      endAt: faker.date.future(),
    };

    it('should return new issue when success', async () => {
      const courier = new Courier();
      const newIssue = new CourierIssue(updateCourierIssueInput);

      const courierUpdateIssueSpy = jest
        .spyOn(courier, 'updateIssue')
        .mockReturnValueOnce(newIssue);
      const couriersRepositorySaveSpy = jest
        .spyOn(couriersRepository, 'save')
        .mockResolvedValueOnce(new Courier({ ...courier, issue: newIssue }));

      const result = await couriersService.updateIssue(
        courier,
        updateCourierIssueInput
      );
      expect(result.message).toEqual(updateCourierIssueInput.message);
      expect(courierUpdateIssueSpy).toHaveBeenCalledWith(
        updateCourierIssueInput
      );
      expect(couriersRepositorySaveSpy).toBeCalledTimes(1);
    });
  });

  describe('removeIssue', () => {
    it('should return courier when success', async () => {
      const courierIssue = new CourierIssue();
      const courier = new Courier({
        id: faker.random.number(),
        issue: courierIssue,
      });

      const courierRemoveIssueSpy = jest
        .spyOn(courier, 'removeIssue')
        .mockImplementationOnce(() => {
          courier.issue = null;
        });
      const couriersRepositorySaveSpy = jest
        .spyOn(couriersRepository, 'save')
        .mockResolvedValueOnce(
          new Courier({
            ...courier,
            issue: null,
          })
        );

      const result = await couriersService.removeIssue(courier);
      expect(result.id).toEqual(courier.id);
      expect(result.issue).toEqual(null);
      expect(courierRemoveIssueSpy).toBeCalledTimes(1);
      expect(couriersRepositorySaveSpy).toHaveBeenCalledWith(courier);
    });
  });
});
