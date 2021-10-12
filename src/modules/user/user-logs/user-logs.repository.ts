import { EntityRepository, Repository } from 'typeorm';

import { UserAppInstallLogEntity } from './entities';

@EntityRepository(UserAppInstallLogEntity)
export class UserAppInstallLogsRepository extends Repository<UserAppInstallLogEntity> {}
