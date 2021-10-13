// @ts-nocheck
const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const { checkJwtValidity, decodeJwt } = require('../../utils/jwt');
const { asyncUpdateProjectById } = require('../../dbSubcriber');
const pool = require('../../dbConnection');

jest.mock('../../utils/jwt', () => ({ checkJwtValidity: jest.fn(), decodeJwt: jest.fn() }));
jest.mock('../../dbSubcriber', () => ({ asyncUpdateProjectById: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

const fakeRequestBody = {
  projectName: faker.lorem.word(),
  projectLeaderId: faker.datatype.number(),
  projectManagerId: faker.datatype.number(),
  projectDescription: faker.lorem.text(),
};

const fakeToken = faker.internet.password();
const fakerUserId = faker.datatype.number();

describe('PUT /project/:id', () => {
  test('return error if authorization header is not set', async () => {
    const res = await request(app).put(`/project/${fakerUserId}`).send(fakeRequestBody);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/token is not present/i);
  });

  test('return error token provided is invalid', async () => {
    checkJwtValidity.mockResolvedValue(false);

    const res = await request(app)
      .put(`/project/${fakerUserId}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(fakeRequestBody);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/invalid token/i);
  });

  test('return error if jwt did not contained correct capability', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: [] });

    const res = await request(app)
      .put(`/project/${fakerUserId}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(fakeRequestBody);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/you are not allowed to perform this operation/i);
  });

  test('return error if request did not contained valid data', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: ['updateProject'] });
    const invalidfakeRequstBody = { ...fakeRequestBody };

    invalidfakeRequstBody.projectLeaderId = faker.datatype.string();

    const res = await request(app)
      .put(`/project/${fakerUserId}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(invalidfakeRequstBody);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/invalid request body/i);
  });

  test('return error if there is error thrown in the database layer', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: ['updateProject'] });
    asyncUpdateProjectById.mockRejectedValue();

    const res = await request(app)
      .put(`/project/${fakerUserId}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(fakeRequestBody);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/problem with server/i);
  });

  test('return success update Project', async () => {
    checkJwtValidity.mockResolvedValue(true);
    decodeJwt.mockResolvedValue({ capabilities: ['updateProject'] });
    asyncUpdateProjectById.mockResolvedValue();

    const res = await request(app)
      .put(`/project/${fakerUserId}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(fakeRequestBody);

    expect(res.statusCode).toBe(200);
    expect(asyncUpdateProjectById).toHaveBeenCalledWith(
      parseInt(fakerUserId, 10),
      fakeRequestBody.projectName,
      fakeRequestBody.projectDescription,
      fakeRequestBody.projectLeaderId,
      fakeRequestBody.projectManagerId
    );
  });
});

afterAll(() => {
  pool.end();
});
