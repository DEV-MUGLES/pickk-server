import { UpdateDigestCommentCountConsumer } from './update-digest-comment-count.consumer';
import { UpdateDigestLikeCountConsumer } from './update-digest-like-count.consumer';
import { RemoveDigestImagesConsumer } from './remove-digest-images.consumer';
import { SendDigestCreationSlackMessageConsumer } from './send-digest-creation-slack-message.consumer';

export const DigestsConsumers = [
  UpdateDigestCommentCountConsumer,
  UpdateDigestLikeCountConsumer,
  RemoveDigestImagesConsumer,
  SendDigestCreationSlackMessageConsumer,
];
