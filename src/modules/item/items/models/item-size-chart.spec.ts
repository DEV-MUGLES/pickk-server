import faker from 'faker';
import { ItemSizeChart } from './item-size-chart.model';

describe('update', () => {
  const addInput = {
    name: faker.name.firstName(),
    accDepth: faker.datatype.float(200),
    accHeight: faker.datatype.float(200),
    accWidth: faker.datatype.float(200),
    chestWidth: faker.datatype.float(200),
    crossStrapLength: faker.datatype.float(200),
    glassBridgeLength: faker.datatype.float(200),
    glassLegLength: faker.datatype.float(200),
    glassWidth: faker.datatype.float(200),
    hemWidth: faker.datatype.float(200),
    riseHeight: faker.datatype.float(200),
    shoulderWidth: faker.datatype.float(200),
    sleeveLength: faker.datatype.float(200),
    thighWidth: faker.datatype.float(200),
    totalLength: faker.datatype.float(200),
    waistWidth: faker.datatype.float(200),
    watchBandDepth: faker.datatype.float(200),
  };

  const updateInput = {
    name: faker.name.lastName(),
    accDepth: faker.datatype.float(200),
    accHeight: faker.datatype.float(200),
    accWidth: faker.datatype.float(200),
    chestWidth: faker.datatype.float(200),
    crossStrapLength: faker.datatype.float(200),
    glassBridgeLength: faker.datatype.float(200),
    glassLegLength: faker.datatype.float(200),
    glassWidth: faker.datatype.float(200),
    hemWidth: faker.datatype.float(200),
    riseHeight: faker.datatype.float(200),
    shoulderWidth: faker.datatype.float(200),
    sleeveLength: faker.datatype.float(200),
    thighWidth: faker.datatype.float(200),
    totalLength: faker.datatype.float(200),
    waistWidth: faker.datatype.float(200),
    watchBandDepth: faker.datatype.float(200),
  };

  it('성공적으로 업데이트한다.', async () => {
    const itemSizeChart = new ItemSizeChart(addInput);
    itemSizeChart.update(updateInput);
    expect(itemSizeChart).toMatchObject(updateInput);
  });
});
