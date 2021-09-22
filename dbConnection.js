const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'host.docker.internal',
  user: 'root',
  password: '',
  database: 'test_activ',
});

module.exports = { pool };
