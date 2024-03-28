import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any, done: Function) {
    try {
      const user = await this.authService.validateUser(payload);
      if (user === true) {
        done(null, payload);
      }
      return done(new UnauthorizedException('INVALID_TOKEN'), false);
    } catch (e) {
      throw new UnauthorizedException('UNAUTHORIZED', e.message);
    }
  }
}
