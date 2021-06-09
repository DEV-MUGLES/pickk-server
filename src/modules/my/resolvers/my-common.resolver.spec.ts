import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { FileUpload } from 'graphql-upload';

import { JwtPayload } from '@auth/dto/jwt.dto';
import { AwsS3ProviderModule, AwsS3ProviderService } from '@providers/aws/s3';

import { UpdateUserInput } from '@user/users/dtos/user.input';
import { User, UserAvatarImage } from '@user/users/models';
import { UsersRepository } from '@user/users/users.repository';
import { UsersService } from '@user/users/users.service';

import { MyCommonResolver } from './my-common.resolver';

const JWT_TOKEN = 'JWT_TOKEN';

describe('MyCommonResolver', () => {
  let myCommonResolver: MyCommonResolver;
  let usersService: UsersService;
  let awsS3ProviderService: AwsS3ProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AwsS3ProviderModule],
      providers: [
        MyCommonResolver,
        UsersService,
        UsersRepository,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => JWT_TOKEN),
          },
        },
      ],
    }).compile();

    myCommonResolver = module.get<MyCommonResolver>(MyCommonResolver);
    usersService = module.get<UsersService>(UsersService);
    awsS3ProviderService = module.get<AwsS3ProviderService>(
      AwsS3ProviderService
    );
  });

  it('should be defined', () => {
    expect(myCommonResolver).toBeDefined();
  });

  const payload: JwtPayload = {
    nickname: faker.lorem.text(),
    sub: faker.datatype.number(),
    code: faker.lorem.text(),
    iat: new Date().getTime(),
    exp: new Date().getTime(),
  };
  const user = new User({
    id: payload.sub,
    code: payload.code,
    nickname: payload.nickname,
  });

  describe('myJwtPayload', () => {
    it('should work without code', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { code, ...payloadWithoutCode } = payload;

      const result = myCommonResolver.myJwtPayload(payloadWithoutCode);
      expect(result).toEqual(payloadWithoutCode);
    });

    it('should return payload', () => {
      const result = myCommonResolver.myJwtPayload(payload);
      expect(result).toEqual(payload);
    });
  });

  describe('me', () => {
    it('should return current user', async () => {
      const usersServiceGetSpy = jest
        .spyOn(usersService, 'get')
        .mockResolvedValueOnce(user);

      const result = await myCommonResolver.me(payload);

      expect(result).toEqual(user);
      expect(usersServiceGetSpy).toHaveBeenCalledWith(payload.sub, []);
    });
  });

  describe('updateMe', () => {
    it('should return updated user', async () => {
      const updateUserInput: UpdateUserInput = {
        name: faker.lorem.text(),
      };
      const usersServiceUpdateSpy = jest
        .spyOn(usersService, 'update')
        .mockResolvedValueOnce(new User({ ...user, ...updateUserInput }));

      const result = await myCommonResolver.updateMe(payload, updateUserInput);

      expect(result.name).toEqual(updateUserInput.name);
      expect(usersServiceUpdateSpy).toHaveBeenCalledWith(
        payload.sub,
        updateUserInput
      );
    });
  });

  describe('updateMyAvatarImage', () => {
    it('should return avatarImage when success', async () => {
      const fileUpload: FileUpload = {
        filename: faker.system.fileName(),
        mimetype: faker.system.mimeType(),
        createReadStream: () => null,
        encoding: faker.lorem.text(),
      };
      const file = new Promise<FileUpload>((resolve) => resolve(fileUpload));

      const s3UploadResult = {
        url: faker.internet.url(),
        key: faker.lorem.text(50),
      };

      const user = new User();

      const awsS3ServiceUploadStreamSpy = jest
        .spyOn(awsS3ProviderService, 'uploadStream')
        .mockResolvedValueOnce(s3UploadResult);
      const usersServiceUpdateAvatarImageSpy = jest
        .spyOn(usersService, 'updateAvatarImage')
        .mockResolvedValueOnce(
          new UserAvatarImage({ key: s3UploadResult.key })
        );

      const result = await myCommonResolver.updateMyAvatarImage(user, { file });
      expect(result.key).toEqual(s3UploadResult.key);
      expect(awsS3ServiceUploadStreamSpy).toHaveBeenCalledWith(
        fileUpload.createReadStream(),
        fileUpload.filename,
        fileUpload.mimetype
      );
      expect(usersServiceUpdateAvatarImageSpy).toHaveBeenCalledWith(
        user,
        s3UploadResult.key
      );
    });
  });

  describe('updateMyPassword', () => {
    it('should return undefined when success', async () => {
      const user = new User();
      const oldPassword = faker.lorem.text(),
        newPassword = faker.lorem.text();

      const usersServiceUpdatePasswordSpy = jest
        .spyOn(usersService, 'updatePassword')
        .mockResolvedValueOnce(undefined);

      const result = await myCommonResolver.updateMyPassword(
        user,
        oldPassword,
        newPassword
      );

      expect(result).toEqual(undefined);
      expect(usersServiceUpdatePasswordSpy).toHaveBeenCalledWith(
        user,
        oldPassword,
        newPassword
      );
    });
  });
});
