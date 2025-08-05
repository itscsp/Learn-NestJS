import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5436,
  username: 'devuser',
  password: '12345',
  database: 'blog',
};

export default config;