import { ProfileType } from '@/src/profile/types/profile.type';
import { IProfileResponse } from '@/src/profile/types/profileResponse.interface';
import { UserEntity } from '@/src/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(profileUsername: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({
      where: {
        username: profileUsername,
      },
    });

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    delete profile?.password;
    delete profile?.email;
    return { ...profile, following: false };
  }

  generateProfileResponse(profile: ProfileType): IProfileResponse {
    return { profile };
  }
}
