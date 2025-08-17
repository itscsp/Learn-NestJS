import { UserTypes } from '@/src/user/types/user.types';

export interface IUserInterface {
  user: UserTypes & { token: string };
}
