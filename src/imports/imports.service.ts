import { Injectable } from '@nestjs/common';
import { ImportsFactory } from './factories/imports.factory';
import { DataSource } from 'typeorm';

@Injectable()
export class ImportsService {
  constructor(private dataSource: DataSource) {}
  async createImport(dto) {
    const handleImport = new ImportsFactory();
    const instance = await handleImport.instance(dto.type, this.dataSource);
    await instance.handle();
  }
}
