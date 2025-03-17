import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }
  async healthCheck(): Promise<any> {
    return await this.dataSource.query('SELECT 1');
  }
}
