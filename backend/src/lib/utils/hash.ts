import * as brcypt from 'bcrypt';

const salt = 5;
export const hashPassword = (password: string): string => {
  return brcypt.hashSync(password, salt);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return brcypt.compareSync(password, hash);
};
