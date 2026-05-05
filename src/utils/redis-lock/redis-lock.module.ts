import { Global, Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { RedisLockService } from './redis-lock.service';

@Global()
@Module({
  imports: [RedisModule],
  providers: [RedisLockService],
  exports: [RedisLockService],
})
export class RedisLockModule {}
