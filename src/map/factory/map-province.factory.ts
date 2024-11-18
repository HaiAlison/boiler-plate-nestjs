import { BaseMapFactory } from './map-base.factory';

export class MapProvinceFactory extends BaseMapFactory {
  async handle() {
    const select = [
      'cte.code::int',
      'cte.full_name as name',
      `concat(cte.division_code,'_',cte.code_name) as codename`,
      'cte.division_type',
      'json_build_array() AS districts',
    ];
    let query =
      'with cte as (select provinces.*, administrative_units.full_name as division_type, ' +
      'administrative_units.code_name as division_code from provinces' +
      ' left join administrative_units on administrative_units.id = provinces.administrative_unit_id )';

    query += `
        select ${select.join(',')}
            from cte
            order by cte.code asc`;
    return await this.dataSource.query(query);
  }
}
