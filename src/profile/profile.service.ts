import { FollowEntity } from '@/src/profile/follow.entity';
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

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({
      where: {
        username: profileUsername,
      },
    });

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    let isFollowed = false;

    if (currentUserId) {
      const follow = await this.followRepository.findOne({
        where: {
          followerId: currentUserId,
          followingId: profile.id,
        },
      });

      isFollowed = Boolean(follow);
    }
    return { ...profile, following: isFollowed };
  }

  async followProfile(
    currentUserId: number,
    followingUsername: string,
  ): Promise<ProfileType> {
    const followingProfile = await this.userRepository.findOne({
      where: {
        username: followingUsername,
      },
    });

    if (!followingProfile) {
      throw new HttpException('Profile does not exists', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === followingProfile.id) {
      throw new HttpException(
        "You con't follow yourself ",
        HttpStatus.NOT_FOUND,
      );
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: followingProfile.id,
      },
    });

    if (!follow) {
      const newFollow = new FollowEntity();
      newFollow.followerId = currentUserId;
      newFollow.followingId = followingProfile.id;

      await this.followRepository.save(newFollow);
    }

    return { ...followingProfile, following: true };
  }

  async unfollowProfile(
    currentUserId: number,
    followingUsername: string,
  ): Promise<ProfileType> {
    const followingProfile = await this.userRepository.findOne({
      where: {
        username: followingUsername,
      },
    });

    if (!followingProfile) {
      throw new HttpException('Profile does not exists', HttpStatus.NOT_FOUND);
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: followingProfile.id,
    });

    return { ...followingProfile, following: false };
  }

  generateProfileResponse(profile: ProfileType): IProfileResponse {
    delete profile?.password;
    delete profile?.email;
    return { profile };
  }
}
