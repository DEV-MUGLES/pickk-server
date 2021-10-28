import { SendOrdersCreatedAlimtalkStep } from './steps';
import { SendOrdersCreatedAlimtalkJob } from './job';

export * from './job';
export const SendOrdersCreatedAlimtalkJobProviders = [
  SendOrdersCreatedAlimtalkStep,
  SendOrdersCreatedAlimtalkJob,
];
