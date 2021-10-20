const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const { checkJwtValidity, decodeJwt } = require('../../utils/jwt');
const pool = require('../../dbConnection');
const { asyncGetActivityByProjectId } = require('../../dbSubcriber');

jest.mock('../../utils/jwt', () => ({ checkJwtValidity: jest.fn(), decodeJwt: jest.fn() }));
jest.mock('../../dbSubcriber', () => ({ asyncGetActivityByProjectId: jest.fn() }));

const fakeToken = faker.internet.password();
const fakeProjectId = faker.datatype.number();
const fakeResponse = {
  userId: faker.datatype.number(),
  assigneeId: faker.datatype.number(),
  name: faker.lorem.word(),
  projectId: fakeProjectId,
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
    const res = await request(app).get(`/activity/project/${fakeProjectId}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/token is not present/i);
  });

  test('return error token provided is invalid', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(false);

    const res = await request(app)
      .get(`/activity/project/${fakeProjectId}`)
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/invalid token/i);
  });

  test('return error if jwt did not contained correct capability', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: [] });

    const res = await request(app)
      .get(`/activity/project/${fakeProjectId}`)
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/you are not allowed to perform this operation/i);
  });

  test('return error if request did not contained valid data', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ userId: faker.datatype.number(), capabilities: ['getActivity'] });

    const invalidProjectId = faker.name.firstName();

    const res = await request(app)
      .get(`/activity/project/${invalidProjectId}`)
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/invalid request body/i);
  });

  test('return error if there is error thrown in the database layer', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ userId: faker.datatype.number(), capabilities: ['getActivity'] });
    // @ts-ignore
    asyncGetActivityByProjectId.mockRejectedValue();

    const res = await request(app)
      .get(`/activity/project/${fakeProjectId}`)
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/problem with server/i);
  });

  test('success return get activities by project id', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ userId: faker.datatype.number(), capabilities: ['getActivity'] });
    // @ts-ignore
    asyncGetActivityByProjectId.mockResolvedValue([fakeResponse, fakeResponse]);

    const res = await request(app)
      .get(`/activity/project/${fakeProjectId}`)
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.activities.length).toBe(2);
    expect(res.body.activities[0]).toStrictEqual(expect.any(Object));
  });
});

afterAll(() => {
  pool.end();
});
