import { UpdateVideoLikeCountConsumer } from './update-video-like-count.consumer';
import { UpdateVideoCommentCountConsumer } from './update-video-comment-count.consumer';
import { SendVideoCreationSlackMessageConsumer } from './send-video-creation-slack-message.consumer';

export const VideosConsumers = [
  UpdateVideoLikeCountConsumer,
  UpdateVideoCommentCountConsumer,
  SendVideoCreationSlackMessageConsumer,
];
