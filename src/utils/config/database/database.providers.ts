import { DataSource, DataSourceOptions } from 'typeorm';
import typeOrmAsyncConfig, { dbConfig } from './config.service';

export const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async () => {
      const dataSource = new DataSource({
        ...dbConfig,
        entities: ['src/entities/*.entity.{ts,js}'],
      } as DataSourceOptions);
      try {
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }
      } catch (error) {
        console.error(error?.message);
      }
      return dataSource;
    },
    dataSourceFactory: async (options) => {
      return await new DataSource(options).initialize();
    },
  },
];
