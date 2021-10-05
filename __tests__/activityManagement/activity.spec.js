const Activity = require('../../model/activity');
const { deleteAllActivity } = require('../../test/initTest');

const activity = new Activity(1, 1, 'New Activity', 1, 'NS', '2021-01-01', '2021-01-02');

beforeEach(() => deleteAllActivity());

test('able to create new activity', async () => {
  await activity.saveActivity();
  expect(activity.activityId).toStrictEqual(expect.any(Number));
});
