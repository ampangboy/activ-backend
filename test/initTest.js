const pool = require('../dbConnection');

const deleteAllUser = () =>
  new Promise((resolve, reject) => {
    pool.query('DELETE FROM user', (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

const deleteAllActivity = () =>
  new Promise((resolve, reject) => {
    pool.query('DELETE FROM activity', (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

const deleteAllProject = () =>
  new Promise((resolve, reject) => {
    pool.query('DELETE FROM project', (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

const resetUserAutoIncrement = () =>
  new Promise((resolve, reject) => {
    pool.query('ALTER TABLE user AUTO_INCREMENT = 1', (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

const resetProjectAutoIncrement = () =>
  new Promise((resolve, reject) => {
    pool.query('ALTER TABLE project AUTO_INCREMENT = 1', (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

const resetDatabase = async () => {
  await deleteAllActivity();
  await deleteAllProject();
  await deleteAllUser();
  await resetUserAutoIncrement();
  await resetProjectAutoIncrement();
};

module.exports = { resetDatabase };
