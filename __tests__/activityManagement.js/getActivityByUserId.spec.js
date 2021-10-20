const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const { checkJwtValidity, decodeJwt } = require('../../utils/jwt');
const pool = require('../../dbConnection');
const { asyncGetActivityByUserId } = require('../../dbSubcriber');

jest.mock('../../utils/jwt', () => ({ checkJwtValidity: jest.fn(), decodeJwt: jest.fn() }));
jest.mock('../../dbSubcriber', () => ({ asyncGetActivityByUserId: jest.fn() }));

const fakeToken = faker.internet.password();

const fakeResponse = {
  userId: faker.datatype.number(),
  assigneeId: faker.datatype.number(),
  name: faker.lorem.word(),
  projectId: faker.datatype.number(),
  status: 'NS',
  startDate: faker.datatype.datetime(),
  plannedEndDate: faker.datatype.datetime(),
  activityId: faker.datatype.number(),
  description: faker.lorem.text(),
  endDate: faker.datatype.datetime(),
  createOn: faker.datatype.datetime(),
};

describe('/GET activity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('return error if authorization header is not set', async () => {
    const res = await request(app).get('/activity');

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/token is not present/i);
  });

  test('return error token provided is invalid', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(false);

    const res = await request(app).get('/activity').set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/invalid token/i);
  });

  test('return error if jwt did not contained correct capability', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: [] });

    const res = await request(app).get('/activity').set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/you are not allowed to perform this operation/i);
  });

  test('return error if there is error thrown in the database layer', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ userId: faker.datatype.number(), capabilities: ['getActivity'] });
    // @ts-ignore
    asyncGetActivityByUserId.mockRejectedValue();

    const res = await request(app).get(`/activity`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/problem with server/i);
  });

  test('sucess return activities', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ userId: faker.datatype.number(), capabilities: ['getActivity'] });
    // @ts-ignore
    asyncGetActivityByUserId.mockResolvedValue([fakeResponse, fakeResponse]);

    const res = await request(app).get(`/activity`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.activities.length).toBe(2);
    expect(res.body.activities[0]).toStrictEqual(expect.any(Object));
  });
});

afterAll(() => {
  pool.end();
});
