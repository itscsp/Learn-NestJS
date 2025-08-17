import { UserTypes } from '@/src/user/types/user.types';

export type ProfileType = UserTypes & { following: boolean };
