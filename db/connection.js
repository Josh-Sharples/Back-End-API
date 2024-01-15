const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log(ENV, '<<< DB set')

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

console.log(process.env.PGDATABASE, '<<< DB we are in')

module.exports = new Pool();
