import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DynamicConnectionModule } from '../dynamic-connection/dynamic-connection.module';
import { DatabaseModule } from '../utils/config/database/database.module';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DynamicConnectionModule, DatabaseModule],
      providers: [UserService],
      controllers: [UserController],
    }).compile();

    userController = app.get<UserController>(UserController);
  });
  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
  it('should return customer with code 25000-132', async () => {
    const testcase = await userController.getUsers();
    expect(testcase[0]).toEqual(expect.objectContaining({ code: '25000-132' }));
  });
});
