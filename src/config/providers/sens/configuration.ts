import { registerAs } from '@nestjs/config';

export default registerAs('sens', () => ({
  ncloudAccessKey: process.env.NCLOUD_ACCESS_KEY,
  ncloudSecretKey: process.env.NCLOUD_SECRET_KEY,
  ncloudSmsServiceId: process.env.NCLOUD_SMS_SERVICE_ID,
  ncloudSmsSecretKey: process.env.NCLOUD_SMS_SECRET_KEY,
  ncloudSmsCallingNumber: process.env.NCLOUD_SMS_CALLING_NUMBER,
  ncloudAlimtalkServiceId: process.env.NCLOUD_ALIMTALK_SERVICE_ID,
  plusFriendId: process.env.PLUS_FRIEND_ID,
}));
