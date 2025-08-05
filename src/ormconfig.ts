import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5436,
  database: 'blog',
  username: 'devuser',
  password: '12345',
  entities: [__dirname + '**/*.entity.{.ts, .js}'],
  synchronize: true, //Don't use this in Prod
};

export default config;