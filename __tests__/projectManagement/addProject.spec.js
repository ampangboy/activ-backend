const request = require('supertest');
const faker = require('faker');
const app = require('../../app');
const { checkJwtValidity, decodeJwt } = require('../../utils/jwt');
const { asyncAddProject } = require('../../dbSubcriber');
const pool = require('../../dbConnection');

jest.mock('../../utils/jwt', () => ({ checkJwtValidity: jest.fn(), decodeJwt: jest.fn() }));
jest.mock('../../dbSubcriber', () => ({ asyncAddProject: jest.fn() }));

const fakeRequestBody = {
  projectName: faker.lorem.word(),
  projectLeaderId: faker.datatype.number(),
  projectManagerId: faker.datatype.number(),
};

const fakeToken = faker.internet.password();

describe('POST /project', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('return error if authorization header is not set', async () => {
    const res = await request(app).post('/project').send(fakeRequestBody);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/token is not present/i);
  });

  test('return error token provided is invalid', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(false);

    const res = await request(app).post('/project').set('Authorization', `Bearer ${fakeToken}`).send(fakeRequestBody);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/invalid token/i);
  });

  test('return error if jwt did not contained correct capability', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: [] });

    const res = await request(app).post('/project').set('Authorization', `Bearer ${fakeToken}`).send(fakeRequestBody);

    expect(res.statusCode).toBe(403);
    expect(res.body.errorMessage).toMatch(/you are not allowed to perform this operation/i);
  });

  test('return error if request body is not valid', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: ['createProject'] });

    const invalidfakeRequestBody = { ...fakeRequestBody };
    // @ts-ignore
    invalidfakeRequestBody.projectLeaderId = faker.name.firstName();

    const res = await request(app)
      .post('/project')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(invalidfakeRequestBody);

    expect(res.statusCode).toBe(400);
    expect(res.body.errorMessage).toMatch(/request does not contain valid values/i);
  });

  test('return error if there is error in database layer', async () => {
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: ['createProject'] });
    // @ts-ignore
    asyncAddProject.mockRejectedValue();

    const res = await request(app).post('/project').set('Authorization', `Bearer ${fakeToken}`).send(fakeRequestBody);

    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/there is something wrong with the server/i);
  });

  test('successful in creating project', async () => {
    const projectId = faker.datatype.number();
    // @ts-ignore
    checkJwtValidity.mockResolvedValue(true);
    // @ts-ignore
    decodeJwt.mockResolvedValue({ capabilities: ['createProject'] });
    // @ts-ignore
    asyncAddProject.mockResolvedValue({ projectId });

    const res = await request(app).post('/project').set('Authorization', `Bearer ${fakeToken}`).send(fakeRequestBody);

    expect(res.statusCode).toBe(201);
    expect(res.body.projectId).toBe(projectId);
  });
});

afterAll(() => {
  pool.end();
});
