import { UpdateVideoLikeCountConsumer } from './update-video-like-count.consumer';
import { UpdateVideoCommentCountConsumer } from './update-video-comment-count.consumer';
import { SendVideoCreationSlackMessageConsumer } from './send-video-creation-slack-message.consumer';
import { UpdateYoutubeVideoDatasConsumer } from './update-youtube-video-datas.consumer';

export const VideosConsumers = [
  UpdateVideoLikeCountConsumer,
  UpdateVideoCommentCountConsumer,
  SendVideoCreationSlackMessageConsumer,
  UpdateYoutubeVideoDatasConsumer,
];
