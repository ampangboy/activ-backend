const { addOneUser } = require('../../test/initTest');
const Project = require('../../model/project');

beforeEach(() => addOneUser());

describe('save project info', () => {
  test('it add new project with success', async () => {
    const project = new Project('Dummy Project', 1, 1);

    await project.saveProjectInfo();

    expect(project.projectId).toStrictEqual(expect.any(Number));
  });
});

describe('update project info', () => {
  test('it update project with success', async () => {
    const project = new Project('Dummy Project', 1, 1, 1);

    expect(async () => {
      await project.updateProjectInfo();
    }).not.toThrow();
  });

  test('it update project with no id without success', async () => {
    const project = new Project('Dummy Project', 1, 1);
    let errMessage;

    try {
      await project.updateProjectInfo();
    } catch (err) {
      errMessage = err;
    }

    expect(errMessage).toStrictEqual(expect.any(Error));
  });
});

describe('delete project info', () => {
  test('it delete project with success', async () => {
    const project = new Project('Dummy Project', 1, 1, 1);
    expect(async () => {
      await project.deleteProjectInfo();
    }).not.toThrow();
  });

  test('it delete project with no id without success', async () => {
    const project = new Project('Dummy Project', 1, 1);

    let errMessage;

    try {
      await project.deleteProjectInfo();
    } catch (err) {
      errMessage = err;
    }

    expect(errMessage).toStrictEqual(expect.any(Error));
  });
});
