// @ts-nocheck
const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const { checkJwtValidity, decodeJwt } = require('../../utils/jwt');
const { asyncGetProjectByProjectId } = require('../../dbSubcriber');
const pool = require('../../dbConnection');

jest.mock('../../utils/jwt', () => ({ checkJwtValidity: jest.fn(), decodeJwt: jest.fn() }));
jest.mock('../../dbSubcriber', () => ({ asyncGetProjectByProjectId: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

const fakeProjectId = faker.datatype.number();
const fakeToken = faker.internet.password();

describe('GET /project/:projectId', () => {
  test('return error if authorization header is not set', async () => {
    const res = await request(app).get(`/project/${fakeProjectId}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/token is not present/i);
  });

  test('return error token provided is invalid', async () => {
    checkJwtValidity.mockResolvedValue(false);

    const res = await request(app).get(`/project/${fakeProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/invalid token/i);
  });

  test('return error if jwt did not contained correct capability', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: [] });

    const res = await request(app).get(`/project/${fakeProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/you are not allowed to perform this operation/i);
  });

  test('return error if request did not contained valid data', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: ['getProject'] });

    const invalidProjectId = faker.name.firstName();

    const res = await request(app).get(`/project/${invalidProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/invalid request body/i);
  });

  test('return error if there is error thrown in the database layer', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: ['getProject'] });
    asyncGetProjectByProjectId.mockRejectedValue();

    const res = await request(app).get(`/project/${fakeProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/problem with server/i);
  });

  test('return success get Project', async () => {
    const fakeDbRes = {
      projectName: faker.lorem.word(),
      projectLeaderId: faker.datatype.number(),
      projectManagerId: faker.datatype.number(),
      projectDescription: faker.lorem.text(),
      projectId: fakeProjectId,
    };

    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: ['getProject'] });
    asyncGetProjectByProjectId.mockResolvedValue(fakeDbRes);

    const res = await request(app).get(`/project/${fakeProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(asyncGetProjectByProjectId).toHaveBeenCalledWith(fakeProjectId);
    expect(res.statusCode).toBe(200);
    expect(res.body.projectId).toBe(fakeProjectId);
    expect(res.body.projectName).toBe(fakeDbRes.projectName);
    expect(res.body.projectLeaderId).toBe(fakeDbRes.projectLeaderId);
    expect(res.body.projectManagerId).toBe(fakeDbRes.projectManagerId);
    expect(res.body.projectDescription).toBe(fakeDbRes.projectDescription);
  });
});

afterAll(() => {
  pool.end();
});
