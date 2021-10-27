import { RemoveNotReferedOrderRelatedEntitiesJob } from './job';
import {
  RemoveOrderBuyersStep,
  RemoveOrderReceiversStep,
  RemoveOrderRefundAccountsStep,
} from './steps';

export * from './job';
export const RemoveNotReferedOrderRelatedEntitiesJobProviders = [
  RemoveNotReferedOrderRelatedEntitiesJob,
  RemoveOrderBuyersStep,
  RemoveOrderReceiversStep,
  RemoveOrderRefundAccountsStep,
];
