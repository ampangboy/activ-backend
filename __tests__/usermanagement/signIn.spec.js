const request = require('supertest');
const User = require('../../model/user');
const { addOneUser } = require('../../test/initTest');
const PasswordEncryptor = require('../../helper/PasswordEncryptor');
const { signJwt } = require('../../utils/jwt');
const app = require('../../app');
const { pool } = require('../../dbConnection');

beforeEach(() => addOneUser());

test('pull password from the database', async () => {
  const password = await User.asyncgetPasswordByEmailAddress('zulfadhli.zaki@beicip.asia');

  expect(password).toStrictEqual(expect.any(String));
});

test('cannot find the email address', async () => {
  const password = await User.asyncgetPasswordByEmailAddress('zfaba.a@gmail.com');

  expect(password).toBe(null);
});

test('compare the password', async () => {
  const passwordEncryptor = new PasswordEncryptor('Activ@123');

  await passwordEncryptor.encryptPassword();

  const isPasswordCorrect = await passwordEncryptor.comparePassword();

  expect(isPasswordCorrect).toBe(true);
});

test('find the user info given email address', async () => {
  const user = await User.findUserInfo('zulfadhli.zaki@beicip.asia');
  expect(user).not.toBe(null);
});

test('generate jwt token', async () => {
  const payload = { foo: 'bar' };
  const token = await signJwt(payload);

  expect(token).toStrictEqual(expect.any(String));
});

test('it should sign ip the user successfully', async () => {
  const res = await request(app).post('/sign-in').send({
    emailAddress: 'zulfadhli.zaki@beicip.asia',
    password: 'Core@123',
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.token).toStrictEqual(expect.any(String));
});

afterAll(() => {
  pool.end();
});
