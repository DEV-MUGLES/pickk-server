import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class PaySuperSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.headers['super-pass'] !== 'aMOrPhaTI1!') {
      throw new ForbiddenException("Sorry, It's super secret!");
    }

    return true;
  }
}
