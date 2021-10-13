const Project = require('../../model/project');

const addProject = async (req, res) => {
  let project;

  try {
    project = new Project(req.body.projectName, req.body.projectLeaderId, req.body.projectManagerId);
  } catch {
    res.status(400);
    return res.json({
      errorMessage: 'Request does not contain valid values, please check you if you have provided the correct datatype',
    });
  }

  try {
    await project.saveProjectInfo();
  } catch {
    res.status(500);
    return res.json({
      errorMessage: 'There is something wrong with the server, please try again later',
    });
  }

  res.body = {
    projectId: project.projectId,
  };
  res.status(201);
  return res.json({
    projectId: project.projectId,
  });
};

module.exports = addProject;
