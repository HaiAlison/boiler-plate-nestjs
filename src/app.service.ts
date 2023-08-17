import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as users from './utils/json-data/users.json';
import { sendPost } from './utils/common/handle';
import { METHOD } from './utils/common/enum';
@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}
  i = 0;
  getHello(): string {
    return 'Hello World!';
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  async createUser(dto) {
    const { source, code, name, address } = dto;
    console.log('count ', ++this.i);
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      let user = await transactionalEntityManager.findOne(User, {
        where: { code },
      });
      const payload = {
        name,
        address,
      };
      if (user) {
        user = transactionalEntityManager.create(User, { ...user, ...payload });
      } else {
        user = transactionalEntityManager.create(User, {
          code,
          source: 'farm',
          name,
          address,
        });
      }
      await transactionalEntityManager.save<User>(user);
    });
  }
  async createMultipleUsers() {
    console.log('calling http://localhost:3000');
    for (const user of users) {
      sendPost(METHOD.post, 'http://localhost:3000/create-user', user);
    }
  }
}
