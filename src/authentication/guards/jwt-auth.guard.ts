import { Injectable } from '@nestjs/common';

import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class JwtAuthGuard extends GqlAuthGuard('jwt') {}
