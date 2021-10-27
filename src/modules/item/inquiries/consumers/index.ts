import { IndexInquiryConsumer } from './index-inquiry.consumer';
import { RemoveInquiryIndexConsumer } from './remove-inquiry-index.consumer';
import { SendInquiryCreationSlackMessageConsumer } from './send-inquiry-creation-slack-message.consumer';
import { SendInquiryCreatedAlimtalkConsumer } from './send-inquiry-created-alimtalk.consumer';

export const InquiriesConsumers = [
  IndexInquiryConsumer,
  RemoveInquiryIndexConsumer,
  SendInquiryCreationSlackMessageConsumer,
  SendInquiryCreatedAlimtalkConsumer,
];
