import { UpdateItemImageUrlConsumer } from './update-item-image-url.consumer';
import { UpdateItemDetailImagesConsumer } from './update-item-detail-images.consumer';
import { ProcessSellerItemsScrapResultConsumer } from './process-seller-items-scrap-result.consumer';
import { UpdateItemDigestStatisticsConsumer } from './update-item-digest-statistics.consumer';
import { SendItemCreationFailSlackMessageConsumer } from './send-item-creation-fail-slack-message.consumer';
import { SendItemCreationSuccessSlackMessageConsumer } from './send-item-creation-success-slack-message.consumer';

export const ItemsConsumers = [
  UpdateItemImageUrlConsumer,
  UpdateItemDetailImagesConsumer,
  ProcessSellerItemsScrapResultConsumer,
  UpdateItemDigestStatisticsConsumer,
  SendItemCreationFailSlackMessageConsumer,
  SendItemCreationSuccessSlackMessageConsumer,
];
