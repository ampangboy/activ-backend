const request = require('supertest');
const faker = require('faker');
const PasswordEncryptor = require('../../helper/PasswordEncryptor');
const app = require('../../app');
const mockDbSubcriber = require('../../dbSubcriber');
const pool = require('../../dbConnection');

jest.mock('../../dbSubcriber', () => ({
  asyncGetUserByEmailAddress: jest.fn(),
  asyncGetPasswordByEmailAddress: jest.fn(),
}));

jest.mock('../../helper/PasswordEncryptor');

const fakeUserResponse = {
  emailAddress: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  jobTitle: faker.name.jobTitle(),
  password: faker.internet.password(),
  userId: faker.datatype.number(),
  createdOn: faker.datatype.datetime(),
};

test('it should return error if there error in database layer', async () => {
  // @ts-ignore
  mockDbSubcriber.asyncGetPasswordByEmailAddress.mockRejectedValue();

  const res = await request(app).post('/sign-in').send({
    emailAddress: fakeUserResponse.emailAddress,
    password: fakeUserResponse.password,
  });

  expect(res.statusCode).toBe(500);
  expect(res.body.errorMessage).toMatch(/There is problem with server/i);
});

test('it should return error if password cannot be retrived', async () => {
  // @ts-ignore
  mockDbSubcriber.asyncGetPasswordByEmailAddress.mockResolvedValue(null);

  const res = await request(app).post('/sign-in').send({
    emailAddress: fakeUserResponse.emailAddress,
    password: fakeUserResponse.password,
  });

  expect(res.statusCode).toBe(403);
  expect(res.body.errorMessage).toMatch(/Incorrect username\/password/i);
});

test('it should return error if password did not match', async () => {
  // @ts-ignore
  mockDbSubcriber.asyncGetPasswordByEmailAddress.mockResolvedValue(null);
  PasswordEncryptor.prototype.comparePassword = jest.fn().mockResolvedValue(false);

  const res = await request(app).post('/sign-in').send({
    emailAddress: fakeUserResponse.emailAddress,
    password: fakeUserResponse.password,
  });

  expect(res.statusCode).toBe(403);
  expect(res.body.errorMessage).toMatch(/Incorrect username\/password/i);
});

test('it should sign in the user successfully', async () => {
  // @ts-ignore
  mockDbSubcriber.asyncGetPasswordByEmailAddress.mockResolvedValue('dummyHashPassword');
  // @ts-ignore
  mockDbSubcriber.asyncGetUserByEmailAddress.mockResolvedValue(fakeUserResponse);
  PasswordEncryptor.prototype.comparePassword = jest.fn().mockResolvedValue(true);

  const res = await request(app).post('/sign-in').send({
    emailAddress: fakeUserResponse.emailAddress,
    password: fakeUserResponse.password,
  });

  expect(PasswordEncryptor.prototype.comparePassword).toHaveBeenCalled();
  expect(mockDbSubcriber.asyncGetUserByEmailAddress).toHaveBeenCalled();
  expect(res.statusCode).toBe(200);
  expect(res.body.token).toStrictEqual(expect.any(String));
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  pool.end();
});
