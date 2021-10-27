import { RemovePayingOrdersStep } from './steps';
import { RemovePayingOrdersJob } from './job';

export * from './job';
export const RemovePayingOrdersJobProviders = [
  RemovePayingOrdersStep,
  RemovePayingOrdersJob,
];
