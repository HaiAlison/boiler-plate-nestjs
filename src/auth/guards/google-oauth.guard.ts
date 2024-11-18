import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor() {
    super({ accessType: 'offline' });
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
