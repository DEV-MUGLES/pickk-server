import * as faker from 'faker';

import { UpdateCourierIssueInput } from '../dtos/courier-issue.input';
import {
  CourierIssueInvalidEndAtException,
  CourierIssueNotFoundException,
} from '../exceptions/courier.exception';
import { CourierIssue } from './courier-issue.model';
import { Courier } from './courier.model';

describe('Courier', () => {
  describe('updateIssue', () => {
    it('should return new issue when success', () => {
      const updateCourierIssueInput: UpdateCourierIssueInput = {
        message: faker.lorem.text(),
        endAt: faker.date.future(),
      };
      const courier = new Courier();

      const result = courier.updateIssue(updateCourierIssueInput);
      expect(result.message).toEqual(updateCourierIssueInput.message);
    });

    it('should throw CourierIssueInvalidEndAtException when past', () => {
      const updateCourierIssueInput: UpdateCourierIssueInput = {
        message: faker.lorem.text(),
        endAt: faker.date.past(),
      };
      const courier = new Courier();

      expect(() => courier.updateIssue(updateCourierIssueInput)).toThrow(
        CourierIssueInvalidEndAtException
      );
    });
  });

  describe('removeIssue', () => {
    it('should return undefined when success', () => {
      const courierIssue = new CourierIssue();
      const courier = new Courier({
        issue: courierIssue,
      });

      const result = courier.removeIssue();
      expect(result).toEqual(undefined);
    });

    it('should throw CourierIssueNotFoundException when not found', () => {
      const courier = new Courier();

      expect(() => courier.removeIssue()).toThrow(
        CourierIssueNotFoundException
      );
    });
  });
});
