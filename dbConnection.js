const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'host.docker.internal',
  user: 'root',
  password: '',
  database: 'activ',
});

pool.query('SELECT * FROM user', (err, res) => {
  const date = new Date(res[0].created_on);
  console.log(date.getMonth());

  pool.end();
});

module.exports = { pool };
