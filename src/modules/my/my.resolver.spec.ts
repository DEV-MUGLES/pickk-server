import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '@src/authentication/dto/jwt.dto';
import * as faker from 'faker';
import { User } from '../user/users/models/user.model';
import { ShippingAddressRepository } from '../user/users/repositories/shipping-address.repository';
import { UserRepository } from '../user/users/repositories/user.repository';
import { UsersService } from '../user/users/users.service';
import { MyResolver } from './my.resolver';

const JWT_TOKEN = 'JWT_TOKEN';
describe('MyResolver', () => {
  let myResolver: MyResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyResolver,
        UsersService,
        UserRepository,
        ShippingAddressRepository,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => JWT_TOKEN),
          },
        },
      ],
    }).compile();

    myResolver = module.get<MyResolver>(MyResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(myResolver).toBeDefined();
  });

  const payload: JwtPayload = {
    username: faker.lorem.text(),
    sub: faker.random.number(),
    code: faker.lorem.text(),
    iat: new Date().getTime(),
    exp: new Date().getTime(),
  };
  const user = new User({
    id: payload.sub,
    code: payload.code,
    name: payload.username,
  });

  describe('myProfile', () => {
    it('should return current user', async () => {
      const usersServiceGetSpy = jest
        .spyOn(usersService, 'get')
        .mockResolvedValue(user);

      const result = await myResolver.myProfile(payload);

      expect(result).toEqual(user);
      expect(usersServiceGetSpy).toHaveBeenCalledWith(payload.sub, []);
    });
  });

  describe('myJwtPayload', () => {
    it('should work without code', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { code, ...payloadWithoutCode } = payload;

      const result = myResolver.myJwtPayload(payloadWithoutCode);
      expect(result).toEqual(payloadWithoutCode);
    });

    it('should return payload', () => {
      const result = myResolver.myJwtPayload(payload);
      expect(result).toEqual(payload);
    });
  });

  describe('updateMyPassword', () => {
    it('should return undefined when success', async () => {
      const user = new User();
      const oldPassword = faker.lorem.text(),
        newPassword = faker.lorem.text();

      const usersServiceUpdatePasswordSpy = jest
        .spyOn(usersService, 'updatePassword')
        .mockResolvedValue(undefined);

      const result = await myResolver.updateMyPassword(
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
