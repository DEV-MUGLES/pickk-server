import faker from 'faker';
import { PointEvent } from './point-event.model';

describe('PointEvent', () => {
  describe('update', () => {
    const createPointEventAttributes = (): Partial<PointEvent> => ({
      title: faker.datatype.string(10),
      content: faker.datatype.string(10),
      amount: faker.datatype.number({ min: 100, max: 1000 }),
      resultBalance: faker.datatype.number({ min: 1000, max: 10000 }),
    });
    it('성공적으로 update한다', () => {
      const pointEvent = new PointEvent({
        ...createPointEventAttributes(),
        id: faker.datatype.number({ min: 1 }),
      });
      const attributes: Partial<PointEvent> = createPointEventAttributes();

      pointEvent.update(attributes);
      expect(pointEvent).toMatchObject(attributes);
      expect(pointEvent.id).toEqual(pointEvent.id);
    });
  });
});
