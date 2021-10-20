const { intValidator } = require('../../helper/validator');
const { asyncGetActivityByProjectId } = require('../../dbSubcriber');

const getActivityByProjectId = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  let activities;

  try {
    intValidator(projectId);
  } catch {
    res.status(500);
    return res.json({ errorMessage: 'Request contain invalid request body, please check the datatype' });
  }

  try {
    activities = await asyncGetActivityByProjectId(projectId);
  } catch {
    res.status(500);
    return res.json({
      errorMessage: 'There is some problem with server, please try again later',
    });
  }

  return res.json({ activities });
};

module.exports = getActivityByProjectId;
