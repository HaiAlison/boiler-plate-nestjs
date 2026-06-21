import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DynamicConnectionModule } from '../dynamic-connection/dynamic-connection.module';
import { UserResolver } from './user.resolver';
import { UserMutation } from './user.mutation';

@Module({
  imports: [DynamicConnectionModule],
  controllers: [UserController],
  providers: [UserService, UserResolver, UserMutation],
  exports: [UserService],
})
export class UserModule { }
