import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const token = await this.authService.signIn(req.user);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/redirect?token=${token}`,
    );
  }
}
