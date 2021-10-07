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
  test('it add update project with success', async () => {
    const project = new Project('Dummy Project', 1, 1, 1);

    expect(async () => {
      await project.updateProjectInfo();
    }).not.toThrow();
  });
});

describe('delete project info', () => {
  test('it add delete project with success', async () => {
    const project = new Project('Dummy Project', 1, 1, 1);

    expect(async () => {
      await project.deleteProjectInfo();
    }).not.toThrow();
  });
});
