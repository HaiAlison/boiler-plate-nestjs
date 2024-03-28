import { DataSource } from 'typeorm';

export class BaseMapFactory {
  protected dataSource: DataSource;

  setDataSource(dataSource) {
    this.dataSource = dataSource;
  }

  async handle(dto) {
    return Promise.resolve(undefined);
  }
}
