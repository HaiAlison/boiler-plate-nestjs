import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  createUser(@Body() dto) {
    // return this.userService.createUser(dto);
  }
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('call')
  call() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const socket = require('socket.io-client')('ws://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('ping', 'Hello from client');
    });

    socket.on('message', (data) => {
      console.log('Received:', data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }
  @Get(':dbName')
  getUsersByDBName(@Param('dbName') dbName: string) {
    return this.userService.getUsers(dbName);
  }

  @Post()
  createMultipleUsers() {
    return this.userService.createMultipleUsers();
  }
}
