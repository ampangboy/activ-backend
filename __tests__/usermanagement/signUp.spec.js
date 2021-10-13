const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const pool = require('../../dbConnection');
const mockDbSubcriber = require('../../dbSubcriber');

jest.mock('../../dbSubcriber', () => ({ asyncCreateUser: jest.fn() }));

const fakeUserRequest = {
  emailAddress: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  jobTitle: null,
};

test('it should return error if request body data is not valid', async () => {
  const fakeInvalidUserRequest = { ...fakeUserRequest };
  fakeInvalidUserRequest.emailAddress = faker.lorem.word();

  const res = await request(app).post('/sign-up').send(fakeInvalidUserRequest);

  expect(res.statusCode).toBe(400);
  expect(res.body.errorMessage).toMatch(/invalid request/i);
});

test('it should sign up the user successfully', async () => {
  // @ts-ignore
  mockDbSubcriber.asyncCreateUser.mockResolvedValue({
    userId: faker.datatype.number(),
    createdOn: faker.datatype.datetime(),
  });

  const res = await request(app).post('/sign-up').send(fakeUserRequest);

  expect(res.statusCode).toBe(201);
});

test('it should give error if user cannot be saved', async () => {
  // @ts-ignore
  mockDbSubcriber.asyncCreateUser.mockRejectedValue();

  const res = await request(app).post('/sign-up').send(fakeUserRequest);

  expect(res.statusCode).toBe(400);
  expect(res.body.errorMessage).toMatch(/unable to process/i);
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  pool.end();
});
