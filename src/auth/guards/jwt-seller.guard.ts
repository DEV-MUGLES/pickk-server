import { Injectable } from '@nestjs/common';

import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class JwtSellerGuard extends GqlAuthGuard('seller') {
  getAuthenticateOptions() {
    return {
      property: 'seller',
    };
  }
}
