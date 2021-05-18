import { genRandomNickname } from './auth.helper';
import {
  randomNicknameAdj,
  randomNicknameNoun,
} from '../constants/nickname.constant';

describe('genRandomNickname', () => {
  it('랜덤 닉네임을 생성한다', () => {
    const [adj, noun] = genRandomNickname().split(' ');

    expect(randomNicknameAdj.includes(adj)).toBeTruthy();
    expect(randomNicknameNoun.includes(noun)).toBeTruthy();
  });
});
