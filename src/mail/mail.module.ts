import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { RedisStorageModule } from '../redis-storage/redis-storage.module';

@Module({
  imports: [RedisStorageModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
