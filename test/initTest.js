const { pool } = require('../dbConnection');
const User = require('../model/user');

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

const addOneUser = async () => {
  const user = new User('zulfadhli.zaki@beicip.asia', 'Core@123', 'Zulfadhli', 'Mohd Zaki', 'Data');

  await deleteAllUser();
  await user.encyptPassword();
  await user.saveUserInfo();
};

module.exports = { deleteAllUser, addOneUser };