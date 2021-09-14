import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { allSettled } from '@common/helpers';
import { UPDATE_USER_FOLLOW_COUNT_QUEUE } from '@queue/constants';
import { UpdateUserFollowCountMto } from '@queue/mtos';
import { FollowsService } from '@user/follows/follows.service';

import { UsersRepository } from '../users.repository';

@SqsProcess(UPDATE_USER_FOLLOW_COUNT_QUEUE)
export class UpdateUserFollowCountConsumer {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly followsService: FollowsService
  ) {}

  @SqsMessageHandler(true)
  async updateFollowCount(messages: AWS.SQS.Message[]) {
    const mtos: UpdateUserFollowCountMto[] = messages.map(({ Body }) =>
      JSON.parse(Body)
    );
    const uniqueIds = [...new Set(mtos.map(({ id }) => id))];

    await allSettled(
      uniqueIds.map(
        (id) =>
          new Promise(async (resolve, reject) => {
            try {
              const followCount = await this.followsService.count(id);
              resolve(this.usersRepository.update(id, { followCount }));
            } catch (err) {
              reject({ id, reason: err });
            }
          })
      )
    );
  }
}
