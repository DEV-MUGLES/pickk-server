import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import qs from 'qs';

import { AppleConfigService } from '@config/providers/apple/config.service';

import { AppleClientType } from './apple.enum';
import { AppleTokenResponse } from './apple.type';

@Injectable()
export class AppleProviderService {
  private static JWKS_URL = 'https://appleid.apple.com/auth/keys';
  private static ACCESS_TOKEN_URL = 'https://appleid.apple.com/auth/token';
  private static ID_KEY = 'sub';
  private static TOKEN_AUDIENCE = 'https://appleid.apple.com';

  private AUTH_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  };

  constructor(
    private readonly configService: AppleConfigService,
    private readonly httpService: HttpService
  ) {}

  async auth(code: string, clientType: AppleClientType) {
    const clientId =
      clientType === AppleClientType.APP
        ? this.configService.appBundleId
        : this.configService.webBundleId;

    const { data: tokenData } = await this.httpService
      .post<AppleTokenResponse>(
        AppleProviderService.ACCESS_TOKEN_URL,
        qs.stringify({
          client_id: clientId,
          client_secret: this.getClientSecret(clientId),
          grant_type: 'authorization_code',
          code,
        }),
        { headers: this.AUTH_HEADERS }
      )
      .toPromise();
    const decoded = await this.decodeIdToken(tokenData.id_token);

    return decoded[AppleProviderService.ID_KEY];
  }

  private getClientSecret(clientId: string): string {
    const { teamId, keyId, secret } = this.configService;

    const payload = {
      iss: teamId,
      aud: AppleProviderService.TOKEN_AUDIENCE,
      sub: clientId,
    };
    const header = {
      alg: 'ES256',
      kid: keyId,
    };

    return jwt.sign(payload, secret, {
      algorithm: 'ES256',
      header,
      expiresIn: '24h',
    });
  }

  /** Return requested Apple public key or all available. */
  private async getPublicKey(header, callback) {
    const client = jwksClient({ jwksUri: AppleProviderService.JWKS_URL });
    client.getSigningKey(header.kid, (err, signingKey) => {
      callback(null, signingKey.getPublicKey());
    });
  }

  /** Decode and validate JWT token from apple and return payload including user data. */
  private async decodeIdToken(idToken: string) {
    if (!idToken) {
      throw new BadRequestException('Missing idToken parameter');
    }

    return new Promise((resolve) => {
      jwt.verify(idToken, this.getPublicKey, (err, decoded) => {
        resolve(decoded);
      });
    });
  }
}
