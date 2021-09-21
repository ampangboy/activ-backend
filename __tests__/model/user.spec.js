const User = require('../../model/user');

const longString = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

let user;

beforeEach(() => {
  user = new User('zfaba.a@gmail.com', '1234zfaba@gmail.com', 'Pally', 'Zacky');
});

test('able to set the email address', () => {
  user.emailAddress = 'zulfadhli.zaki@beicip.asia';

  expect(user.emailAddress).toBe('zulfadhli.zaki@beicip.asia');
});

test('email address throw error if not valid', () => {
  const invalidEmail = 'thisIsJustAString';

  expect(() => {
    user.emailAddress = longString;
  }).toThrow(`string exceed allowable character`);

  expect(() => {
    user.emailAddress = invalidEmail;
  }).toThrow(`${invalidEmail} is not a valid email address`);
});

test('able to set password', () => {
  user.password = 'newpassword';

  expect(user.password).toBe('newpassword');
});

test('password throw error if not valid', () => {
  expect(() => {
    user.password = longString;
  }).toThrow(`string exceed allowable character`);
});

test('able to set new firstName', () => {
  user.firstName = 'new First Name';

  expect(user.firstName).toBe('new First Name');
});

test('firstName throw error if not valid', () => {
  expect(() => {
    user.firstName = longString;
  }).toThrow(`string exceed allowable character`);
});

test('able to set new lastName', () => {
  user.lastName = 'new Last Name';

  expect(user.lastName).toBe('new Last Name');
});

test('lastName throw error if not valid', () => {
  expect(() => {
    user.lastName = longString;
  }).toThrow(`string exceed allowable character`);
});

test('able to set new job Title', () => {
  user.jobTitle = 'New Job Title';

  expect(user.jobTitle).toBe('New Job Title');
});

test('jobTitle throw error if not valid', () => {
  expect(() => {
    user.jobTitle = longString;
  }).toThrow(`string exceed allowable character`);
});

test('able to set new job user Id', () => {
  user.userId = 11;

  expect(user.userId).toEqual(11);
});

test('able to set new created on date', () => {
  user.createdOn = '2021-08-25 08:34:33';

  expect(user.createdOn.getFullYear()).toBe(2021);
  expect(user.createdOn.getMonth()).toBe(7);
  expect(user.createdOn.getDate()).toBe(25);
  expect(user.createdOn.getHours()).toBe(8);
  expect(user.createdOn.getMinutes()).toBe(34);
  expect(user.createdOn.getSeconds()).toBe(33);
});
