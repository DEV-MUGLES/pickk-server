import * as faker from 'faker';

import { BankCode } from '@common/constants';
import { IAccount } from '@common/interfaces';

import {
  UpdateSellerClaimPolicyInput,
  UpdateSellerSettlePolicyInput,
} from '../dtos';
import {
  SellerClaimPolicy,
  SellerSettleAccount,
  SellerSettlePolicy,
} from './policies';

import { Seller } from './seller.model';

const getAccountMockData = (): Partial<IAccount> => ({
  bankCode: BankCode.AbnAmro,
  ownerName: faker.name.findName(),
  number: faker.phone.phoneNumber('###########'),
});

const getClaimPolicyMockData = (): Partial<SellerClaimPolicy> => ({
  fee: faker.datatype.number(),
  picName: faker.name.findName(),
  phoneNumber: faker.phone.phoneNumber('###########'),
});

const getSettlePolicyMockData = (): Partial<SellerSettlePolicy> => ({
  email: faker.internet.email(),
  picName: faker.name.findName(),
  phoneNumber: faker.phone.phoneNumber('###########'),
  account: new SellerSettleAccount(getAccountMockData()),
});

describe('Seller', () => {
  describe('updateClaimPolicy', () => {
    it('성공한다', () => {
      const claimPolicy = new SellerClaimPolicy(getClaimPolicyMockData());
      const seller = new Seller({ claimPolicy });

      const updateInput: UpdateSellerClaimPolicyInput =
        getClaimPolicyMockData();

      const result = seller.updateClaimPolicy(updateInput);
      expect(result).toMatchObject(updateInput);
    });
  });

  describe('updateSettlePolicy', () => {
    it('성공한다', () => {
      const settlePolicy = new SellerSettlePolicy(getSettlePolicyMockData());
      const seller = new Seller({ settlePolicy });

      const updateInput: UpdateSellerSettlePolicyInput = {
        ...getSettlePolicyMockData(),
        accountInput: getAccountMockData(),
      };
      delete updateInput['account'];

      const { account, ...settlePolicyAttributes } =
        seller.updateSettlePolicy(updateInput);
      expect(account).toMatchObject(updateInput.accountInput);
      delete updateInput['accountInput'];
      expect(settlePolicyAttributes).toMatchObject(updateInput);
    });

    it('Account가 없었으면 추가하면서 성공한다', () => {
      const settlePolicy = new SellerSettlePolicy({
        ...getSettlePolicyMockData(),
        account: null,
      });
      const seller = new Seller({ settlePolicy });

      const updateInput: UpdateSellerSettlePolicyInput = {
        ...getSettlePolicyMockData(),
        accountInput: getAccountMockData(),
      };
      delete updateInput['account'];

      const { account, ...settlePolicyAttributes } =
        seller.updateSettlePolicy(updateInput);
      expect(account).toMatchObject(updateInput.accountInput);
      delete updateInput['accountInput'];
      expect(settlePolicyAttributes).toMatchObject(updateInput);
    });

    it('settlePolicy 자체가 없었으면 추가하면서 성공한다', () => {
      const seller = new Seller();

      const updateInput: UpdateSellerSettlePolicyInput = {
        ...getSettlePolicyMockData(),
        accountInput: getAccountMockData(),
      };
      delete updateInput['account'];

      const { account, ...settlePolicyAttributes } =
        seller.updateSettlePolicy(updateInput);
      expect(account).toMatchObject(updateInput.accountInput);
      delete updateInput['accountInput'];
      expect(settlePolicyAttributes).toMatchObject(updateInput);
    });
  });
});
