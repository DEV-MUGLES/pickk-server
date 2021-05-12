import {
  randomNicknameAdj,
  randomNicknameNoun,
} from '@src/authentication/constants/nickname.constant';

export const genRandomNickname = () => {
  return (
    randomNicknameAdj[Math.floor(Math.random() * randomNicknameAdj.length)] +
    ' ' +
    randomNicknameNoun[Math.floor(Math.random() * randomNicknameNoun.length)]
  );
};
