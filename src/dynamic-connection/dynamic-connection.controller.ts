import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DynamicConnectionService } from './dynamic-connection.service';
import {
  CreateDynamicConnectionDto,
  UpdateDynamicConnectionDto,
} from './dto/dynamic-connection.dto';

@Controller('dynamic-connection')
export class DynamicConnectionController {
  constructor(
    private readonly dynamicConnectionService: DynamicConnectionService,
  ) {}

  @Post('create')
  async addDatabase(@Body() config: CreateDynamicConnectionDto) {
    const dbName = config.name; // You can define a name for the database
    await this.dynamicConnectionService.addDatabaseConfig(config);
    return { message: `Database ${dbName} added.` };
  }
  @Patch('update')
  async updateDatabaseConfig(@Body() config: UpdateDynamicConnectionDto) {
    const dbName = config.name; // You can define a name for the database
    await this.dynamicConnectionService.updateDatabaseConfig(config);
    return { message: `Database ${dbName} updated.` };
  }

  @Get()
  getDatabase() {
    return this.dynamicConnectionService.getAllDatabaseNames();
  }

  @Get(':dbname')
  createConnection(@Param('dbname') dbname) {
    return this.dynamicConnectionService.createConnection(dbname);
  }

  @Get('config/:dbname')
  getDatabaseConfig(@Param('dbname') dbname) {
    return this.dynamicConnectionService.getDatabaseConfig(dbname);
  }
}
