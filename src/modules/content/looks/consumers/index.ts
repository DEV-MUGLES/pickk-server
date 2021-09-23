import { UpdateLookLikeCountConsumer } from './update-look-like-count.consumer';
import { UpdateLookCommentCountConsumer } from './update-look-comment-count.consumer';
import { SendLookCreationSlackMessageConsumer } from './send-look-creation-slack-message.consumer';
import { RemoveLookImagesConsumer } from './remove-look-images.consumer';

export const LooksConsumers = [
  UpdateLookLikeCountConsumer,
  UpdateLookCommentCountConsumer,
  SendLookCreationSlackMessageConsumer,
  RemoveLookImagesConsumer,
];
