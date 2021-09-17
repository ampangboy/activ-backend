const User = require('../../model/user');

let user;

beforeAll(() => {
  user = new User('zfaba.a@gmail.com', '1234zfaba@gmail.com', 'Pally', 'Zacky');
});

test('able to set the email address', () => {
  user.emailAddress = 'zulfadhli.zaki@beicip.asia';

  expect(user.emailAddress).toBe('zulfadhli.zaki@beicip.asia');
});
