import { Module } from '@nestjs/common';

import { CommentsModule } from './comments/comments.module';
import { DigestsModule } from './digests/digests.module';
import { LooksModule } from './looks/looks.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [CommentsModule, DigestsModule, LooksModule, VideosModule],
})
export class ContentModule {}
