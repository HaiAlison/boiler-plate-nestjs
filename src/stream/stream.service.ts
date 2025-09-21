import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PgQueryStream = require('pg-query-stream'); // dùng require
import { Readable } from 'stream';
@Injectable()
export class StreamService {
  constructor(private readonly dataSource: DataSource) {}
  async streamBigTable(res: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // <-- cái này hợp lệ
    console.time('streamingBigTable');
    const pool = (this.dataSource.driver as any).master;
    const client = await pool.connect();
    const query = `SELECT * FROM female_events limit 10000`;
    const queryStream = new PgQueryStream(query, [], { batchSize: 100 });
    const dbStream: Readable = client.query(queryStream);

    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');
    dbStream.on('data', (row) => {
      res.write(JSON.stringify(row) + '\n'); // NDJSON
    });
    dbStream.on('end', () => {
      res.end();
      console.timeEnd('streamingBigTable');
      queryRunner.release();
    });
  }
}
