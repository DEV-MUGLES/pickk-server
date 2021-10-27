import { IndexInquiryConsumer } from './index-inquiry.consumer';
import { SendInquiryCreationSlackMessageConsumer } from './send-inquiry-creation-slack-message.consumer';
import { SendInquiryCreatedAlimtalkConsumer } from './send-inquiry-created-alimtalk.consumer';

export const InquiriesConsumers = [
  IndexInquiryConsumer,
  SendInquiryCreationSlackMessageConsumer,
  SendInquiryCreatedAlimtalkConsumer,
];
