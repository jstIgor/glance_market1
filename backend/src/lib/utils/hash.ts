import * as brcypt from 'bcrypt';

const salt = 5;
export const hashPassword = (password: string): Promise<string> => {
  return brcypt.hash(password, salt);
};

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return brcypt.compare(password, hash);
};
