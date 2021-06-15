import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with mysql config based operations.
 *
 * @class
 */
@Injectable()
export class MysqlConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('mysql.host');
  }
  get port(): string {
    return this.configService.get<string>('mysql.port');
  }
  get username(): string {
    return this.configService.get<string>('mysql.username');
  }
  get password(): string {
    return this.configService.get<string>('mysql.password');
  }
  get database(): string {
    return this.configService.get<string>('mysql.database');
  }
  get logging(): boolean {
    return this.configService.get<boolean>('mysql.logging');
  }
  get migrationsRun(): boolean {
    return this.configService.get<boolean>('mysql.migrationsRun');
  }
  get caches(): number {
    return this.configService.get<number>('mysql.caches');
  }
}
