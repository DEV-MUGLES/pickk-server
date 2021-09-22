import { UpdateLookLikeCountConsumer } from './update-look-like-count.consumer';
import { UpdateLookCommentCountConsumer } from './update-look-comment-count.consumer';
import { SendLookCreationSlackMessageConsumer } from './send-look-creation-slack-message.consumer';

export const LooksConsumers = [
  UpdateLookLikeCountConsumer,
  UpdateLookCommentCountConsumer,
  SendLookCreationSlackMessageConsumer,
];
