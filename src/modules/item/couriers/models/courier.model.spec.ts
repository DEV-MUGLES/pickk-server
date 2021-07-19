import * as faker from 'faker';

import { UpdateCourierIssueInput } from '../dtos';
import { CourierIssueInvalidEndAtException } from '../exceptions';
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
});
