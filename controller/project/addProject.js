const Project = require('../../model/project');

const addProject = async (req, res) => {
  let project;

  try {
    project = new Project(req.body.projectName, req.body.projectLeaderId, req.body.projectManagerId);
  } catch {
    res.body = { error: 'request does not contain valid values' };
    return res.status(501).end();
  }

  try {
    await project.asyncAddProject();
  } catch {
    res.body = { error: 'cannot save project' };
    return res.status(501).end();
  }

  res.body = {
    projectId: project.projectId,
  };
  return res.status(201).end();
};

module.exports = addProject;
