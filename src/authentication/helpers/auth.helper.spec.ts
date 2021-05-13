import { genRandomNickname } from './auth.helper';
import {
  randomNicknameAdj,
  randomNicknameNoun,
} from '../constants/nickname.constant';

describe('genRandomNickname', () => {
  it('랜덤 닉네임을 생성한다', () => {
    const result = genRandomNickname().split(' ');

    const isAvailAdj = randomNicknameAdj.find((e) => e == result[0]);
    const isAvailNoun = randomNicknameNoun.find((e) => e == result[1]);

    expect(isAvailAdj).toBeTruthy();
    expect(isAvailNoun).toBeTruthy();
  });
});
