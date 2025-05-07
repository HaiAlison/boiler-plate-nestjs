import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
      prompt: 'consent',
      scope: ['email', 'profile', 'https://mail.google.com/'],
    });
  }
  canActivate(context: ExecutionContext) {
    if (context.switchToHttp().getRequest().query['error']) {
      console.error(
        'Google OAuth Error:',
        context.switchToHttp().getRequest().query['error'],
      );
      //redirect to frontend with error
      context
        .switchToHttp()
        .getResponse()
        .redirect(`${process.env.FRONTEND_URL}/auth/redirect?error=1`);
    }
    return super.canActivate(context);
  }
}
