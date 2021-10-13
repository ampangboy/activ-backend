// @ts-nocheck
const { intValidator } = require('../../helper/validator');
const { asyncGetProjectByProjectId } = require('../../dbSubcriber');

const getProject = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  let dbRes;

  try {
    intValidator(projectId);
  } catch {
    res.status(500);
    return res.json({ errorMessage: 'Request contain invalid request body, please check the datatype' });
  }

  try {
    dbRes = await asyncGetProjectByProjectId(projectId);
  } catch {
    res.status(500);
    return res.json({
      errorMessage: 'There is some problem with server, please try again later',
    });
  }

  return res.json({
    projectId: dbRes.projectId,
    projectName: dbRes.projectName,
    projectManagerId: dbRes.projectManagerId,
    projectLeaderId: dbRes.projectLeaderId,
    projectDescription: dbRes.projectDescription,
  });
};

module.exports = getProject;
