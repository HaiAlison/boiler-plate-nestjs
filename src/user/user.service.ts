import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as users from '../utils/json-data/users.json';
import { DynamicConnectionService } from '../dynamic-connection/dynamic-connection.service';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  generateCodeBaseOnSequence,
  handleError,
  callAxios,
} from '../utils/common/handle';
import { CreateUserDto, FacebookLoginDto } from './dto/user.dto';
import { METHOD } from '../utils/common/enum';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
  async getUser(id, dbName?) {
    try {
      let connection = this.dataSource;
      if (dbName) {
        connection = await this.dynamicDbService.createConnection(dbName);
      }
      const repository = await connection.manager.getRepository(User);
      return repository.findOneOrFail({ where: { id } });
    } catch (e) {
      return handleError(e);
    }
  }

  async createUser(dto: CreateUserDto): Promise<any> {
    const { name, address, source } = dto;

    const z = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const code = await generateCodeBaseOnSequence(
          User.name,
          'HH',
          5,
          transactionalEntityManager,
        );
        const x = await transactionalEntityManager.upsert(
          User,
          { code, address, source },
          ['code', 'source'],
        );
        return { success: true, message: 'create', id: x.identifiers[0].id };
      },
    );
    return z;
  }

  async continueWithFacebook(dto: FacebookLoginDto) {
    try {
      const { name, email } = dto;
      const facebookData = await callAxios(
        METHOD.get,
        `${this.configService.get('FACEBOOK_ME_URL')}?access_token=${
          dto.accessToken
        }`,
      );
      const providerId = facebookData?.data?.id;
      if (dto.fbProviderId != providerId) {
        throw new UnauthorizedException('Invalid user');
      } else {
        let user = await User.createQueryBuilder('user')
          .where('user.email = :email', { email: dto.email })
          .andWhere('user.fbProviderId = :providerId', { providerId })
          .getOne();
        if (!user) {
          user = await this.createUser({
            source: 'farm',
            name,
            email,
            fbProviderId: providerId,
          });
        }

        const accessToken = this.jwtService.sign({ id: user.id });
        return { accessToken };
      }
    } catch (e) {
      throw handleError(e);
    }
  }

  async continueWithGoogle(dto: any) {
    try {
      const { name, email } = dto;
      let user = await User.createQueryBuilder('user')
        .where('user.email = :email', { email: dto.email })
        .andWhere('user.googleProviderId = :providerId', {
          providerId: dto.googleProviderId,
        })
        .getOne();
      if (!user) {
        user = await this.createUser({
          source: 'farm',
          name,
          email,
          googleProviderId: dto.googleProviderId,
        });
      }
      const accessToken = this.jwtService.sign({ id: user.id });
      return { accessToken };
    } catch (e) {
      throw handleError(e);
    }
  }

  async createUserMultipleDatabase(dto, connection: DataSource) {
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
        this.createUserMultipleDatabase(user, database);
      }
    }
  }
}
