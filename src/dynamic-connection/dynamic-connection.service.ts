import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Database } from '../entities/database.entity';
import { cleanObject, handleError } from '../utils/common/handle';
import { CreateDynamicConnectionDto } from './dto/dynamic-connection.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import * as crypto from 'crypto';
@Injectable()
export class DynamicConnectionService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}
  private publicKey = process.env.PUBLIC_KEY;
  private privateKey = process.env.PRIVATE_KEY;
  async addDatabaseConfig(config: CreateDynamicConnectionDto) {
    try {
      const { database, port, name, host, password, username, type } = config;
      const query = this.dataSource.manager;
      const db = query.create(Database, {
        database,
        port,
        name,
        host,
        username,
        type,
      });
      db.password = this.encryptPassword(password);
      await query.save(db);
    } catch (e) {
      return handleError(e);
    }
  }

  async updateDatabaseConfig(config) {
    try {
      const { database, port, name, host, password, username, type } = config;
      const query = this.dataSource.getRepository(Database);
      const db = await query.findOneBy({ port, host });
      Object.assign(
        db,
        cleanObject({ database, port, name, host, password, username, type }),
      );
      if (password) db.password = this.encryptPassword(password);
      await query.save(db);
    } catch (e) {
      return handleError(e);
    }
  }

  async getDatabaseConfig(name: string) {
    const data = await this.dataSource.manager
      .createQueryBuilder(Database, 'database')
      .where('name = :name', { name })
      .addSelect(['database.password'])
      .getOne();
    if (data) delete data.id;
    return data;
  }

  getAllDatabaseNames() {
    return this.dataSource
      .getRepository(Database)
      .createQueryBuilder('databases')
      .select(['name'])
      .orderBy('name')
      .getRawMany();
  }

  async createConnection(name: string) {
    console.log('name', name);
    const config = await this.getDatabaseConfig(name);
    if (!config) {
      throw new BadRequestException('DATABASE NOT FOUND');
    }
    config.password = this.decryptPassword(config.password);
    const configs = {
      ...config,
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsRun: true,
      migrationsTableName: 'typeorm_migrations',
      synchronize: false,
      ssl: false,
      logging: true,
    } as DataSourceOptions;
    const connection = new DataSource(configs);
    if (!connection.isInitialized) await connection.initialize();
    console.log('isInitialized', connection.isInitialized);
    return connection;
  }

  encryptPassword(password) {
    const encryptedData = crypto.publicEncrypt(
      this.publicKey,
      Buffer.from(password),
    );
    return encryptedData.toString('base64');
  }

  decryptPassword(encryptedPassword) {
    const decryptedData = crypto.privateDecrypt(
      this.privateKey,
      Buffer.from(encryptedPassword, 'base64'),
    );
    return decryptedData.toString();
  }
}
