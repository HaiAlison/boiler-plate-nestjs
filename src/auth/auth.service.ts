import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { google } from 'googleapis';
import { RedisStorageService } from '../redis-storage/redis-storage.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisStorage: RedisStorageService,
  ) {}

  async validateUser(payload: any) {
    const user = await this.findUserByEmail(payload.email);
    return !!user;
  }

  generateJwt(payload: any) {
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }
    let userExists = await this.findUserByEmail(user.email);
    if (!userExists) {
      userExists = await this.registerUser(user);
    } else {
      userExists.refresh_token = user.refresh_token || userExists.refresh_token;
      userExists.last_login = new Date();
      await userExists.save();
      await this.redisStorage.set(
        userExists.id + '_oauth2Client',
        user.refresh_token || userExists.refresh_token,
      );
    }
    return this.generateJwt({
      id: userExists.id,
      sub: userExists.google_provider_id,
      email: userExists.email,
      avatar: userExists.avatar,
      expires_in:
        new Date(userExists.last_login).getTime() + 7 * 24 * 60 * 60 * 1000,
    });
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  async registerUser(user) {
    const userExists = await this.findUserByEmail(user.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const newUser = User.create(user);
    await newUser.save();
    return newUser;
  }

  async oauthLogin(user_id: string) {
    let userRefreshToken: string = await this.redisStorage.get(
      `${user_id}_oauth2Client`,
    );
    if (!userRefreshToken) {
      const user = await User.findOne({ where: { id: user_id } });
      if (!user) {
        throw new BadRequestException('Không tìm thấy người dùng');
      }
      await this.redisStorage.set(
        `${user_id}_oauth2Client`,
        user.refresh_token,
      );
      userRefreshToken = user.refresh_token;
    }
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground', // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: userRefreshToken,
    });
    return oauth2Client;
  }
}
