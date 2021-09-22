const { pool } = require('../dbConnection');
const User = require('../model/user');

beforeEach(() => {
  pool.query('DELETE FROM user');
});

test('save the User object to the database', async () => {
  const user = new User('zfaba.a@gmail.com', 'Core@123', 'Zulfadhli', 'Mohd Zaki', 'Data');

  await user.saveUserInfo();
  expect(user.userId).toEqual(expect.any(Number));
  expect(user.createdOn).toStrictEqual(expect.any(Date));
});

afterAll(() => {
  pool.end();
});
