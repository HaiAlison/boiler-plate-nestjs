import { Injectable } from '@nestjs/common';
import { ImportsFactory } from './factories/imports.factory';
import { DataSource } from 'typeorm';
import { handleError } from '../utils/common/handle';
import { Workbook } from 'exceljs';

@Injectable()
export class ImportsService {
  constructor(private dataSource: DataSource) {}
  async createImport(dto, file: Express.Multer.File, user_id) {
    try {
      const workbook = new Workbook();
      await workbook.xlsx.load(file.buffer);
      const handleImport = new ImportsFactory();
      const instance = await handleImport.instance(dto.type, this.dataSource);
      await instance.handle(dto, workbook, user_id);
    } catch (error) {
      throw handleError(error);
    }
  }
}
