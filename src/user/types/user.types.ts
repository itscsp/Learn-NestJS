import { UserEntity } from '@/src/user/user.entity';

export type UserTypes = Omit<UserEntity, 'hashPassword'>;
