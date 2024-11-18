import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id') id) {
    return this.userService.getUser(id);
  }

  @Get(':dbName')
  getUsersByDBName(@Param('dbName') dbName: string) {
    return this.userService.getUsers(dbName);
  }

  @Post()
  createMultipleUsers() {
    return this.userService.createMultipleUsers();
  }
  @Post('facebook-login')
  continueWithFacebook(@Body() dto) {
    return this.userService.continueWithFacebook(dto);
  }
  @Post('google-login')
  continueWithGoogle(@Body() dto: any) {
    return this.userService.continueWithGoogle(dto);
  }
}
