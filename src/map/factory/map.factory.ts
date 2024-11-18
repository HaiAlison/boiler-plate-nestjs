import { BaseMapFactory } from './map-base.factory';
import { MapProvinceFactory } from './map-province.factory';
import { MapWardFactory } from './map-ward.factory';
import { BadRequestException } from '@nestjs/common';
import { MapDistrictFactory } from './map-district.factory';
import { MapDepthFactory } from './map-depth.factory';

export class MapFactory {
  private _mapBaseFactory: BaseMapFactory;
  instance(dto, type) {
    this._mapBaseFactory = new BaseMapFactory();
    switch (type) {
      case 'api':
        this._mapBaseFactory = new MapDepthFactory();
        break;
      case 'p':
        this._mapBaseFactory = new MapProvinceFactory();
        break;
      case 'd':
        this._mapBaseFactory = new MapDistrictFactory();
        break;
      case 'w':
        this._mapBaseFactory = new MapWardFactory();
        break;
      default:
        throw new BadRequestException('not matched any type');
    }
    return this._mapBaseFactory;
  }
}
