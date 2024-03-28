import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as users from '../utils/json-data/users.json';
import { DynamicConnectionService } from '../dynamic-connection/dynamic-connection.service';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { handleError } from '../utils/common/handle';

@Injectable()
export class UserService {
  constructor(
    private dynamicDbService: DynamicConnectionService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}
  i = 0;
  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async getUsers(dbName?) {
    try {
      let connection = this.dataSource;
      if (dbName) {
        connection = await this.dynamicDbService.createConnection(dbName);
      }
      const repository = await connection.manager.getRepository(User);
      return repository.find();
    } catch (e) {
      return handleError(e);
    }
  }

  async createUser(dto, connection: DataSource) {
    const { code, name, address, dbName } = dto;
    console.log('count ', ++this.i);
    await connection.transaction(async (transactionalEntityManager) => {
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
  // @Cron('15 * * * * *')
  async createMultipleUsers() {
    const databases = await this.dynamicDbService.getAllDatabaseNames();
    const x = [];
    for (const database of databases) {
      const connection = await this.dynamicDbService.createConnection(
        database.name,
      );
      x.push(connection);
    }
    for (const database of x) {
      for (const user of users) {
        this.createUser(user, database);
      }
    }
  }
}
