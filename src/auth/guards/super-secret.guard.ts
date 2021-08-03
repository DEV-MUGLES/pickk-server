import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

/**
 * 이 가드는 Rest api endpoint(@Controller)에서만 적용되는 가드입니다.
 */
@Injectable()
export class SuperSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.headers['super-pass'] !== 'aMOrPhaTI1!') {
      throw new ForbiddenException("Sorry, It's super secret!");
    }

    return true;
  }
}
