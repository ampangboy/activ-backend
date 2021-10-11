const faker = require('faker');
const { resetDatabase } = require('../test/initTest');
const dbSubscriber = require('../dbSubcriber');
const pool = require('../dbConnection');

const user = {
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  jobTitle: faker.name.jobTitle(),
  password: faker.internet.password(),
};

beforeAll(() => resetDatabase());

describe('database integration for user table', () => {
  let resCreateUser;

  beforeAll(async () => {
    resCreateUser = await dbSubscriber.asyncCreateUser(
      user.email,
      user.firstName,
      user.lastName,
      user.jobTitle,
      user.password
    );

    // eslint-disable-next-line no-useless-return
    return;
  });

  test('insert user to user table', async () => {
    expect(resCreateUser[0][0].userId).toStrictEqual(expect.any(Number));
    expect(resCreateUser[0][0].createdOn).toStrictEqual(expect.any(Date));
  });

  test("get user's password, given emailAddress", async () => {
    const res = await dbSubscriber.asyncGetPasswordByEmailAddress(user.email);
    expect(res).toBe(user.password);
  });

  test('returned undefined while trying to search unknown emailAddress', async () => {
    const res = await dbSubscriber.asyncGetPasswordByEmailAddress('thisemailisnotexist@domain.com');
    expect(res).toBe(null);
  });
});

afterAll(() => {
  pool.end();
});
