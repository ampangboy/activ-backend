const User = require('../../model/user');
const { addOneUser } = require('../../test/initTest');
const PasswordEncryptor = require('../../helper/PasswordEncryptor');

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
