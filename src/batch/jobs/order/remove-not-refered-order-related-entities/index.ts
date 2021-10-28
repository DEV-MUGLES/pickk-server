import { RemoveNotReferedOrderRelatedEntitiesJob } from './job';
import {
  RemoveOrderBuyersStep,
  RemoveOrderReceiversStep,
  RemoveOrderRefundAccountsStep,
  RemoveOrderVbankReceiptsStep,
} from './steps';

export * from './job';
export const RemoveNotReferedOrderRelatedEntitiesJobProviders = [
  RemoveNotReferedOrderRelatedEntitiesJob,
  RemoveOrderBuyersStep,
  RemoveOrderReceiversStep,
  RemoveOrderRefundAccountsStep,
  RemoveOrderVbankReceiptsStep,
];
