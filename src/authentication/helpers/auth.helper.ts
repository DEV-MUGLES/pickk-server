import {
  randomNicknameAdj,
  randomNicknameNoun,
} from '@src/authentication/constants/nickname.constant';

export const genRandomNickname = () => {
  let number = Math.abs(Math.random() * 100 - 1).toFixed(0);
  if (Number(number) < 10) number = '0' + number;

  return (
    randomNicknameAdj[Math.floor(Math.random() * randomNicknameAdj.length)] +
    randomNicknameNoun[Math.floor(Math.random() * randomNicknameNoun.length)] +
    number
  );
};
