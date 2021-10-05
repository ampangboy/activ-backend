const Project = require('../../model/project');

const longString = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

let project;

beforeEach(() => {
  project = new Project('Test Project', 1, 1);
});

test('it can set project name properly', () => {
  const projectName = 'New Project Name';

  project.projectName = projectName;
  expect(project.projectName).toBe(projectName);

  expect(() => {
    project.projectName = 1;
  }).toThrow('1 is not a valid String');

  expect(() => {
    project.projectName = longString;
  }).toThrow('string exceed allowable character');
});

test('it can set project leader id properly', () => {
  const projectLeaderId = 2;

  project.projectLeaderId = projectLeaderId;
  expect(project.projectLeaderId).toBe(projectLeaderId);

  expect(() => {
    project.projectLeaderId = '1';
  }).toThrow('1 is not a valid Number format');
});

test('it can set project manager id properly', () => {
  const projectManagerId = 2;

  project.projectManagerId = projectManagerId;
  expect(project.projectManagerId).toBe(projectManagerId);

  expect(() => {
    project.projectManagerId = '1';
  }).toThrow('1 is not a valid Number format');
});

test('it can set project id properly', () => {
  expect(project.projectId).toBe(null);
  const projectId = 2;

  project.projectId = projectId;
  expect(project.projectId).toBe(projectId);

  expect(() => {
    project.projectId = '1';
  }).toThrow('1 is not a valid Number format');
});

test('it can set project description properly', () => {
  expect(project.projectDescription).toBe(null);

  project.projectDescription = longString;
  expect(project.projectDescription).toBe(longString);

  expect(() => {
    project.projectDescription = 1;
  }).toThrow('1 is not a valid String');
});
