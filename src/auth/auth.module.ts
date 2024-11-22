import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleOauthStrategy } from './strategies/google.strategy';
import { RedisStorageModule } from '../redis-storage/redis-storage.module';
import { JwtStrategy } from './strategies/jwt.strategy';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: '60s' },
    }),
    RedisStorageModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, GoogleOauthStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
