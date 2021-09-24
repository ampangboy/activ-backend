const request = require('supertest');
const { pool } = require('../../dbConnection');
const User = require('../../model/user');
const PasswordEncryptor = require('../../helper/PasswordEncryptor');
const app = require('../../app');
const { deleteAllUser } = require('../../test/initTest');

beforeEach(() => deleteAllUser());

test('save the User object to the database', async () => {
  const user = new User('zfaba.a@gmail.com', 'Core@123', 'Zulfadhli', 'Mohd Zaki', 'Data');

  await user.saveUserInfo();
  expect(user.userId).toEqual(expect.any(Number));
  expect(user.createdOn).toStrictEqual(expect.any(Date));
});

test('genereate SHA from password', async () => {
  const plainTextPassword = 'test@123';

  const passwordEncryptor = new PasswordEncryptor(plainTextPassword);
  await passwordEncryptor.encryptPassword();

  expect(passwordEncryptor.hashPassword).toStrictEqual(expect.any(String));
});

test('encrpted the password and assigned to the User object', async () => {
  const plainTextPassword = 'Core@123';

  const user = new User('zfaba.a@gmail.com', plainTextPassword, 'Zulfadhli', 'Mohd Zaki', 'Data');
  await user.encyptPassword();

  expect(user.password).not.toBe(plainTextPassword);
  expect(user.password).toStrictEqual(expect.any(String));
});

test('it should sign up the user successfully', async () => {
  const res = await request(app).post('/sign-up').send({
    emailAddress: 'zfaba.a@gmail.com',
    password: 'Core@123',
    firstName: 'Pally',
    lastName: 'Zaki',
    jobTitle: 'Data',
  });

  expect(res.statusCode).toBe(200);
});

afterAll(() => {
  pool.end();
});
