import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  createUser(@Body() dto) {
    // return this.userService.createUser(dto);
  }
  @Get(':dbName')
  getUsers(@Param('dbName') dbName: string) {
    return this.userService.getUsers(dbName);
  }

  @Post()
  createMultipleUsers() {
    return this.userService.createMultipleUsers();
  }
}
