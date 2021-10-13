const Project = require('../../model/project');

const updateProject = async (req, res) => {
  let project;

  try {
    project = new Project(
      req.body.projectName,
      req.body.projectLeaderId,
      req.body.projectManagerId,
      parseInt(req.params.projectId, 10),
      req.body.projectDescription
    );
  } catch {
    res.status(500);
    return res.json({ errorMessage: 'Request contain invalid request body, please check the datatype' });
  }

  try {
    await project.updateProjectInfo();
  } catch {
    res.status(500);
    return res.json({ errorMessage: 'There is problem with server, please try again' });
  }

  return res.end();
};

module.exports = updateProject;
