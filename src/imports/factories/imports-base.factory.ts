import { DataSource } from 'typeorm';

export class ImportsBaseFactory {
  private dataSource: DataSource;



  setDataSource(dataSource: DataSource) {
    this.dataSource = dataSource;
  }
  async handle() {
    return Promise.resolve();
  }
}
