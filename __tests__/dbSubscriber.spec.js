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
let resCreateUser;
let resCreateProject;
let project;

beforeAll(() => resetDatabase());

describe('database integration for user table', () => {
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
    expect(resCreateUser.userId).toStrictEqual(expect.any(Number));
    expect(resCreateUser.createdOn).toStrictEqual(expect.any(Date));
  });

  test("get user's password, given emailAddress", async () => {
    const res = await dbSubscriber.asyncGetPasswordByEmailAddress(user.email);
    expect(res).toBe(user.password);
  });

  test('returned undefined while trying to search unknown emailAddress', async () => {
    const res = await dbSubscriber.asyncGetPasswordByEmailAddress('thisemailisnotexist@domain.com');
    expect(res).toBe(null);
  });

  test('return the user, given the email Address', async () => {
    const res = await dbSubscriber.asyncGetUserByEmailAddress(user.email);
    expect(res.userId).toStrictEqual(expect.any(Number));
    expect(res.password).toBe(user.password);
  });

  test('return null, given the email Address if user did not exist', async () => {
    const res = await dbSubscriber.asyncGetUserByEmailAddress('thisemailisnotexist@domain.com');
    expect(res).toBe(null);
  });
});

describe('database integration for project table', () => {
  beforeAll(() => {
    project = {
      projectName: faker.random.words(),
      projectDescription: faker.lorem.text(),
      projectLeaderId: resCreateUser.userId,
      projectManagerId: resCreateUser.userId,
    };
  });

  test('add project with success', async () => {
    resCreateProject = await dbSubscriber.asyncAddProject(
      project.projectName,
      project.projectDescription,
      project.projectLeaderId,
      project.projectManagerId
    );
    expect(resCreateProject.projectId).toStrictEqual(expect.any(Number));
  });

  test('update project with success', async () => {
    const res = await dbSubscriber.asyncUpdateProjectById(
      resCreateProject.projectId,
      faker.lorem.words(),
      project.projectDescription,
      project.projectLeaderId,
      project.projectManagerId
    );
    expect(res).toStrictEqual(expect.any(Object));
  });

  test('get project with success', async () => {
    const res = await dbSubscriber.asyncGetProjectByProjectId(resCreateProject.projectId);

    expect(res.projectId).toBe(resCreateProject.projectId);
    expect(res.projectLeaderId).toBe(project.projectLeaderId);
    expect(res.projectManagerId).toBe(project.projectManagerId);
    expect(res.projectDescription).toBe(project.projectDescription);
  });

  test('delete project with success', async () => {
    const res = await dbSubscriber.asyncDeleteProjectById(resCreateProject.projectId);

    expect(res).toStrictEqual(expect.any(Object));
  });
});

describe('database integration for activity table', () => {
  let fakeActivity;
  let resCreateActivity;

  beforeAll(async () => {
    resCreateProject = await dbSubscriber.asyncAddProject(
      project.projectName,
      project.projectDescription,
      project.projectLeaderId,
      project.projectManagerId
    );

    fakeActivity = {
      assigneeId: resCreateUser.userId,
      userId: resCreateUser.userId,
      name: faker.lorem.words(),
      description: faker.lorem.text(),
      projectId: resCreateProject.projectId,
      status: 'NS',
      startDate: faker.datatype.datetime(),
      plannedEndDate: faker.datatype.datetime(),
      endDate: faker.datatype.datetime(),
    };
  });

  test('success creating activity', async () => {
    resCreateActivity = await dbSubscriber.asyncCreateActivity(
      fakeActivity.assigneeId,
      fakeActivity.userId,
      fakeActivity.name,
      fakeActivity.description,
      fakeActivity.projectId,
      fakeActivity.status,
      fakeActivity.startDate,
      fakeActivity.plannedEndDate,
      fakeActivity.endDate
    );

    // @ts-ignore
    expect(resCreateActivity.activityId).toStrictEqual(expect.any(Number));
  });

  test('success get activity by project', async () => {
    const res = await dbSubscriber.asyncGetActivityByProjectId(fakeActivity.projectId);

    // @ts-ignore
    expect(res).toStrictEqual(expect.any(Array));
    expect(res.length).toBe(1);
  });

  test('success get activity by user', async () => {
    const res = await dbSubscriber.asyncGetActivityByUserId(fakeActivity.userId);

    // @ts-ignore
    expect(res).toStrictEqual(expect.any(Array));
    expect(res.length).toBe(1);
  });

  test('success update activity by id', async () => {
    const res = await dbSubscriber.asyncUpdateActivitybyActivityId(
      fakeActivity.userId,
      fakeActivity.assigneeId,
      faker.lorem.words(),
      fakeActivity.description,
      fakeActivity.projectId,
      fakeActivity.status,
      fakeActivity.startDate,
      fakeActivity.plannedEndDate,
      fakeActivity.endDate,
      resCreateActivity.activityId
    );

    // @ts-ignore
    expect(res).toStrictEqual(expect.any(Object));
  });

  test('delete activity by id', async () => {
    const res = await dbSubscriber.asyncDeleteActivityByActivityId(resCreateActivity.projectId);

    expect(res).toStrictEqual(expect.any(Object));
  });
});

afterAll(() => {
  pool.end();
});
