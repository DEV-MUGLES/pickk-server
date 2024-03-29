import { randomNicknameAdj, randomNicknameNoun } from '@auth/constants';

export const genRandomNickname = () => {
  return (
    randomNicknameAdj[Math.floor(Math.random() * randomNicknameAdj.length)] +
    ' ' +
    randomNicknameNoun[Math.floor(Math.random() * randomNicknameNoun.length)]
  );
};
