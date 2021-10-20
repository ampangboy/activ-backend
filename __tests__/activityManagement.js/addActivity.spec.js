const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const { checkJwtValidity, decodeJwt } = require('../../utils/jwt');
const pool = require('../../dbConnection');
const { asyncCreateActivity } = require('../../dbSubcriber');

jest.mock('../../utils/jwt', () => ({ checkJwtValidity: jest.fn(), decodeJwt: jest.fn() }));
jest.mock('../../dbSubcriber', () => ({ asyncCreateActivity: jest.fn() }));

const fakeRequestBody = {
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

const fakeToken = faker.internet.password();

describe('POST /activity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('return error if authorization header is not set', async () => {
    const res = await request(app).post('/activity').send(fakeRequestBody);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/token is not present/i);
  });

  test('return error token provided is invalid', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(false);

    const res = await request(app).post('/activity').set('Authorization', `Bearer ${fakeToken}`).send(fakeRequestBody);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/invalid token/i);
  });

  test('return error if jwt did not contained correct capability', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: [] });

    const res = await request(app).post('/activity').set('Authorization', `Bearer ${fakeToken}`).send(fakeRequestBody);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/you are not allowed to perform this operation/i);
  });

  test('return error if request body is not valid', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: ['createActivity'] });

    const invalidfakeRequestBody = { ...fakeRequestBody };
    // @ts-ignore
    invalidfakeRequestBody.projectId = faker.name.firstName();

    const res = await request(app)
      .post('/activity')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(invalidfakeRequestBody);

    expect(res.statusCode).toBe(400);
    expect(res.body.errorMessage).toMatch(/request does not contain valid values/i);
  });

  test('return error if there is error in database layer', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: ['createActivity'] });
    // @ts-ignore
    asyncCreateActivity.mockRejectedValue();

    const res = await request(app).post('/activity').set('Authorization', `Bearer ${fakeToken}`).send(fakeRequestBody);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/there is something wrong with the server/i);
  });

  test('successful in creating project', async () => {
    const activityId = faker.datatype.number();
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: ['createActivity'] });
    // @ts-ignore
    asyncCreateActivity.mockResolvedValue({ activityId });

    const res = await request(app).post('/activity').set('Authorization', `Bearer ${fakeToken}`).send(fakeRequestBody);

    expect(res.statusCode).toBe(201);
    expect(res.body.activityId).toBe(activityId);
  });
});

afterAll(() => {
  pool.end();
});
