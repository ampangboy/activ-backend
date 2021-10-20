const Activity = require('../../model/activity');

const addActivity = async (req, res) => {
  let activity;
  const reqBody = req.body;

  try {
    activity = new Activity(
      reqBody.userId,
      reqBody.assigneeId,
      reqBody.name,
      reqBody.projectId,
      reqBody.status,
      new Date(reqBody.startDate),
      new Date(reqBody.plannedEndDate),
      reqBody.activityId,
      reqBody.description,
      new Date(reqBody.endDate)
    );
  } catch (err) {
    res.status(400);
    return res.json({
      errorMessage: 'Request does not contain valid values, please check you if you have provided the correct datatype',
    });
  }

  try {
    await activity.saveActivity();
  } catch {
    res.status(500);
    return res.json({
      errorMessage: 'There is something wrong with the server, please try again later',
    });
  }

  res.status(201);
  return res.json({ activityId: activity.activityId });
};

module.exports = addActivity;
