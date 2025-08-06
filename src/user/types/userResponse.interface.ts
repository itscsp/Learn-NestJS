import { IUser } from '@/src/user/types/user.types';

export interface IUserInterface {
  user: IUser & { token: string };
}
