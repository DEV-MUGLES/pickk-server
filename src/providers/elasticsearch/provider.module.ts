import { Module } from '@nestjs/common';
import {
  ElasticsearchModule,
  ElasticsearchModuleAsyncOptions,
  ElasticsearchModuleOptions,
} from '@nestjs/elasticsearch';

import {
  ElasticsearchConfigModule,
  ElasticsearchConfigService,
} from '@config/providers/elasticsearch';

import { SearchService } from './provider.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ElasticsearchConfigModule],
      useFactory: async (configService: ElasticsearchConfigService) =>
        ({
          node: configService.node,
          auth: {
            username: configService.username,
            password: configService.password,
          },
        } as ElasticsearchModuleOptions),
      inject: [ElasticsearchConfigService],
    } as ElasticsearchModuleAsyncOptions),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class ElasticsearchProviderModule {}
