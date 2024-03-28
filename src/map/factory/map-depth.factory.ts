import { BaseMapFactory } from './map-base.factory';

export class MapDepthFactory extends BaseMapFactory {
  async handle({ depth }) {
    const select = [
      'cte.name',
      'cte.code::int',
      'cte.full_name',
      'cte.code_name as codename',
      'cte.division_type',
    ];
    let query =
      'with cte as (select provinces.*, administrative_units.full_name as division_type from provinces' +
      ' left join administrative_units on administrative_units.id = provinces.administrative_unit_id )';
    switch (depth) {
      case '1':
        select.push(`json_build_array() AS districts`);
        break;
      case '2':
        select.push(
          `json_agg(json_build_object(
            'name', concat(administrative_units.full_name,' ',districts.name),
            'code', districts.code::int,
            'division_type', administrative_units.full_name,
            'codename', concat(administrative_units.code_name,'_',districts.code_name),                
            'province_code', cte.code::int,
            'wards', '[]'::json
            )) AS districts`,
        );
        break;
      case '3':
        select.push(
          `json_agg(
            json_build_object(
                'name', concat(administrative_units.full_name,' ',districts.name),
                'code', districts.code::int,
                'division_type', administrative_units.full_name,
                'division_code', administrative_units.code_name,
                'codename', concat(administrative_units.code_name,'_',districts.code_name),                
                'short_codename', districts.code_name,
                'province_code', cte.code::int,
                'wards', (
                        SELECT json_agg(json_build_object(
                            'name', w.name,
                            'code', w.code::int,
                            'codename', concat(au_w.code_name,'_',w.code_name),                
                            'division_type', au_w.full_name,
                            'short_codename', w.code_name
                        ))
                        FROM wards w
                        JOIN administrative_units au_w ON w.administrative_unit_id = au_w.id
                        WHERE w.district_code = districts.code
                    )
            )
          ) AS districts`,
        );
        break;
    }
    query += `
        select ${select.join(',')}
            from cte
            left join districts on districts.province_code = cte.code
            left join administrative_units on administrative_units.id = districts.administrative_unit_id
            GROUP BY cte.name, cte.code, cte.code_name, cte.full_name, cte.division_type 
            order by cte.code asc`;
    return await this.dataSource.query(query);
  }
}
