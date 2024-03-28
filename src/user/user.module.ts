import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DynamicConnectionModule } from '../dynamic-connection/dynamic-connection.module';

@Module({
  imports: [DynamicConnectionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
