import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { CouriersRepository } from './couriers.repository';
import { CouriersResolver } from './couriers.resolver';
import { CouriersService } from './couriers.service';
import { UpdateCourierIssueInput } from './dtos/courier-issue.input';
import { CourierIssue } from './models/courier-issue.model';
import { Courier } from './models/courier.model';

describe('CouriersResolver', () => {
  let couriersResolver: CouriersResolver;
  let couriersService: CouriersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouriersResolver, CouriersService, CouriersRepository],
    }).compile();

    couriersResolver = module.get<CouriersResolver>(CouriersResolver);
    couriersService = module.get<CouriersService>(CouriersService);
  });

  it('should be defined', () => {
    expect(couriersResolver).toBeDefined();
  });

  describe('updateCourierIssue', () => {
    it('should return new issue', async () => {
      const courierId = faker.random.number();
      const courier = new Courier({ id: courierId });

      const updateCourierIssueInput: UpdateCourierIssueInput = {
        message: faker.lorem.text(),
        endAt: faker.date.future(),
      };
      const newCourierIssue = new CourierIssue(updateCourierIssueInput);

      const couriersServiceGetSpy = jest
        .spyOn(couriersService, 'get')
        .mockResolvedValueOnce(courier);
      const couriersServiceUpdateIssueSpy = jest
        .spyOn(couriersService, 'updateIssue')
        .mockResolvedValueOnce(newCourierIssue);

      const result = await couriersResolver.updateCourierIssue(
        courierId,
        updateCourierIssueInput
      );
      expect(result).toEqual(newCourierIssue);
      expect(couriersServiceGetSpy).toHaveBeenCalledWith(courierId);
      expect(couriersServiceUpdateIssueSpy).toHaveBeenCalledWith(
        courier,
        updateCourierIssueInput
      );
    });
  });

  describe('removeCourierIssue', () => {
    it('should remove courier', async () => {
      const courierIssue = new CourierIssue();
      const courierId = faker.random.number();
      const courier = new Courier({ id: courierId, issue: courierIssue });
      const removedCourier = new Courier({
        ...courier,
        issue: null,
      });

      const couriersServiceGetSpy = jest
        .spyOn(couriersService, 'get')
        .mockResolvedValueOnce(courier);
      const couriersServiceRemoveIssueSpy = jest
        .spyOn(couriersService, 'removeIssue')
        .mockResolvedValueOnce(removedCourier);

      const result = await couriersResolver.removeCourierIssue(courierId);
      expect(result).toEqual(removedCourier);
      expect(couriersServiceGetSpy).toHaveBeenCalledWith(courierId);
      expect(couriersServiceRemoveIssueSpy).toHaveBeenCalledWith(courier);
    });
  });
});
