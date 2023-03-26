import { createPool, Pool, PoolConnection } from 'mysql2/promise';

const pool: Pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'eventwebsite',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

  export { pool };
export {};