const Activity = require('../../model/activity');

let activity;
const longString = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

beforeEach(() => {
  activity = new Activity(1, 1, 'A simple task', 1, 'NS', new Date('1999-10-05'), new Date('1999-10-05'));
});

test('succesfully assigned and expect error on userId', () => {
  activity.userId = 2;
  expect(activity.userId).toBe(2);

  expect(() => {
    activity.userId = '2';
  }).toThrow('2 is not a valid Number format');

  expect(() => {
    activity.userId = null;
  }).toThrow('null is not a valid Number format');
});

test('succesfully assigned and expect error on activityId', () => {
  activity.activityId = 2;
  expect(activity.activityId).toBe(2);

  activity.activityId = null;
  expect(activity.activityId).toBe(null);

  expect(() => {
    activity.activityId = '2';
  }).toThrow('2 is not a valid Number format');
});

test('succesfully assigned and expect error on assigneeId', () => {
  activity.assigneeId = 2;
  expect(activity.assigneeId).toBe(2);

  expect(() => {
    activity.assigneeId = '2';
  }).toThrow('2 is not a valid Number format');

  expect(() => {
    activity.assigneeId = null;
  }).toThrow('null is not a valid Number format');
});

test('able to set new name', () => {
  activity.name = 'new Last Name';

  expect(activity.name).toBe('new Last Name');

  expect(() => {
    activity.name = longString;
  }).toThrow(`string exceed allowable character`);

  expect(() => {
    activity.name = 1;
  }).toThrow(`1 is not a valid String`);
});

test('succesfully assigned and expect error on projectId', () => {
  activity.projectId = 2;
  expect(activity.projectId).toBe(2);

  expect(() => {
    activity.projectId = '2';
  }).toThrow('2 is not a valid Number format');

  expect(() => {
    activity.projectId = null;
  }).toThrow('null is not a valid Number format');
});

test('able to set new description', () => {
  activity.description = longString;

  expect(activity.description).toBe(longString);

  expect(() => {
    activity.description = 1;
  }).toThrow(`1 is not a valid String`);
});
