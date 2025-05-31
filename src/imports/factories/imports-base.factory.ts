import { DataSource } from 'typeorm';
import { Workbook } from 'exceljs';
import { JwtPayload } from '../../utils/common/interface';

export class ImportsBaseFactory {
  private dataSource: DataSource;

  setDataSource(dataSource: DataSource) {
    this.dataSource = dataSource;
  }
  async handle(dto, workbook: Workbook, jwtPayload: JwtPayload): Promise<void> {
    return Promise.resolve();
  }
}
