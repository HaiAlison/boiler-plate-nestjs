import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth2';
import * as process from 'node:process';
import { generateCodeBaseOnSequence } from '../../utils/common/handle';
import { DataSource } from 'typeorm';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(
  GoogleStrategy,
  'google',
) {
  constructor(
    private configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI + '/auth/google/callback',
      scope: [
        'email',
        'profile',
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/contacts',
      ],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      avatar: photos[0].value,
      source: 'google',
      code: await generateCodeBaseOnSequence('user', 'GG', 6, this.dataSource),
      google_provider_id: profile.sub,
      refresh_token: _refreshToken,
    };
    console.log('refresh_token', _refreshToken);
    done(null, user);
  }
}
