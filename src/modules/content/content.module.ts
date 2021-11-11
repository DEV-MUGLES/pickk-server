import { Module } from '@nestjs/common';

import { CommentsModule } from './comments/comments.module';
import { ContentCommonModule } from './common/common.module';
import { DigestsModule } from './digests/digests.module';
import { KeywordsModule } from './keywords/keywords.module';
import { LikesModule } from './likes/likes.module';
import { LooksModule } from './looks/looks.module';
import { OwnsModule } from './owns/owns.module';
import { StyleTagsModule } from './style-tags/style-tags.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    CommentsModule,
    ContentCommonModule,
    DigestsModule,
    KeywordsModule,
    LikesModule,
    LooksModule,
    OwnsModule,
    StyleTagsModule,
    VideosModule,
  ],
})
export class ContentModule {}
