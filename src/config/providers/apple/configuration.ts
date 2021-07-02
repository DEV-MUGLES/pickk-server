import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';

export default registerAs('apple', () => {
  const secret = readFileSync(
    'src/config/providers/apple/sign-in.key.p8'
  ).toString();

  return {
    appBundleId: process.env.APPLE_APP_BUNDLE_ID,
    webBundleId: process.env.APPLE_WEB_BUNDLE_ID,
    teamId: process.env.APPLE_TEAM_ID,
    keyId: process.env.APPLE_KEY_ID,
    secret,
  };
});
