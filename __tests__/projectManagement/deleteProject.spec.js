// @ts-nocheck
const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const { checkJwtValidity, decodeJwt } = require('../../utils/jwt');
const { asyncDeleteProjectById } = require('../../dbSubcriber');

jest.mock('../../utils/jwt', () => ({ checkJwtValidity: jest.fn(), decodeJwt: jest.fn() }));
jest.mock('../../dbSubcriber', () => ({ asyncDeleteProjectById: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

const fakeProjectId = faker.datatype.number();
const fakeToken = faker.internet.password();

describe('DELETE /project/:projectId', () => {
  test('return error if authorization header is not set', async () => {
    const res = await request(app).delete(`/project/${fakeProjectId}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/token is not present/i);
  });

  test('return error token provided is invalid', async () => {
    checkJwtValidity.mockResolvedValue(false);

    const res = await request(app).delete(`/project/${fakeProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/invalid token/i);
  });

  test('return error if jwt did not contained correct capability', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: [] });

    const res = await request(app).delete(`/project/${fakeProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/you are not allowed to perform this operation/i);
  });

  test('return error if request did not contained valid data', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: ['deleteProject'] });

    const invalidProjectId = faker.name.findName();

    const res = await request(app).delete(`/project/${invalidProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/invalid request body/i);
  });

  test('return error if there is error thrown in the database layer', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: ['deleteProject'] });
    asyncDeleteProjectById.mockRejectedValue();

    const res = await request(app).delete(`/project/${fakeProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/problem with server/i);
  });

  test('return success update Project', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: ['deleteProject'] });
    asyncDeleteProjectById.mockResolvedValue();

    const res = await request(app).delete(`/project/${fakeProjectId}`).set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(200);
    expect(asyncDeleteProjectById).toHaveBeenCalledWith(fakeProjectId);
  });
});
