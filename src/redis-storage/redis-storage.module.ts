import { Module } from '@nestjs/common';
import { RedisStorageService } from './redis-storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        });
        return {
          store,
          ttl: 3 * 60000, // 3 minutes
        };
      },
    }),
  ],
  providers: [RedisStorageService],
  exports: [RedisStorageService],
})
export class RedisStorageModule {}
