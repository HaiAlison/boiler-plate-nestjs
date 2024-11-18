import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateJwt(payload: any) {
    return this.jwtService.sign(payload, { secret: 'dev' });
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }
    let userExists = await this.findUserByEmail(user.email);
    if (!userExists) {
      userExists = await this.registerUser(user);
    }
    return this.generateJwt({
      sub: userExists.google_provider_id,
      email: userExists.email,
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
}
