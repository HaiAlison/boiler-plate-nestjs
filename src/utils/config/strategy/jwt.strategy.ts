import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import {
  UnauthorizedException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

import { JwtPayload } from '../../common/interface';
import { UserService } from '../../../user/user.service';
import { User } from '../../../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  public async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.getUser(payload.id);
    if (!user) {
      throw new NotFoundException(`User with id ${payload.id} is not found.`);
    }
    if (Date.now() > payload.exp * 1000) {
      throw new UnauthorizedException('Session expired.');
    }
    return user;
  }
}
