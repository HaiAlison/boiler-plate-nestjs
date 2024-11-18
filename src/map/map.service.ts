import { Injectable } from '@nestjs/common';
import MapDataSource from '../utils/config/database/map.data-source';
import { MapFactory } from './factory/map.factory';

@Injectable()
export class MapService {
  async getData(dto, type) {
    const map = new MapFactory();
    const mapInstance = map.instance(dto, type);
    const dataSource = MapDataSource;
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    mapInstance.setDataSource(dataSource);
    return await mapInstance.handle(dto);
  }
}
