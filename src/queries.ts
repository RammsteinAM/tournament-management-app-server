import * as pg  from 'pg';

const pool = new pg.Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})