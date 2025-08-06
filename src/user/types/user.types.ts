import { UserEntity } from '@/src/user/user.entity';

export type IUser = Omit<UserEntity, 'hashPassword'>;
