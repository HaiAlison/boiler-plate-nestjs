import { BaseMapFactory } from './map-base.factory';

export class MapDistrictFactory extends BaseMapFactory {
  async handle() {
    const select = [
      'cte.code::int',
      'cte.full_name as name',
      `concat(cte.division_code,'_',cte.code_name) as codename`,
      'cte.division_type',
      'cte.province_code::int',
      'json_build_array() AS wards',
    ];
    let query =
      'with cte as (select districts.*, administrative_units.full_name as division_type, ' +
      'administrative_units.code_name as division_code from districts ' +
      'left join administrative_units on administrative_units.id = districts.administrative_unit_id )';

    query += `
        select ${select.join(',')}
            from cte
            order by cte.code asc`;
    return await this.dataSource.query(query);
  }
}
